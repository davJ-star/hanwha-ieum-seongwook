package com.example.demo.controller;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import com.example.demo.Enum.Role;
import com.example.demo.dto.CommentRequest;
import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.User;
import com.example.demo.service.CommentService;
import com.example.demo.service.PostService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CommunityController {
    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("/community")
    public ResponseEntity<Map<String, Object>> communityHome(
            @RequestParam(required = false) PostCategory category,
            @RequestParam(required = false) DisabilityType disabilityType,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        Page<PostResponse> posts = postService.getPosts(category, disabilityType, pageable);

        Map<String, Object> fields = new HashMap<>();

        // 선택적 필드 추가
        if (category != null) {
            fields.put("category", category.getValue());
        }
        if (disabilityType != null) {
            fields.put("disabilityType", disabilityType.getValue());
        }

        // 필수 필드 추가
        fields.put("categories", Arrays.stream(PostCategory.values())
                .map(PostCategory::getValue)
                .collect(Collectors.toList()));

        fields.put("disabilityTypes", Arrays.stream(DisabilityType.values())
                .map(DisabilityType::getValue)
                .collect(Collectors.toList()));

        // posts 변환
        List<Map<String, Object>> postsResponse = posts.getContent().stream()
                .map(post -> {
                    Map<String, Object> postMap = new HashMap<>();
                    postMap.put("id", post.getId());
                    postMap.put("title", post.getTitle());
                    postMap.put("category", post.getCategory().getValue());
                    postMap.put("disabilityType", post.getDisabilityType().getValue());
                    postMap.put("authorName", post.getAuthorName());
                    postMap.put("createdAt", post.getCreatedAt().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm")));
                    postMap.put("commentsCount", post.getComments().size());
                    return postMap;
                })
                .collect(Collectors.toList());
        fields.put("posts", postsResponse);

        // pagination 정보 추가
        Map<String, Object> pagination = new HashMap<>();
        pagination.put("currentPage", pageable.getPageNumber());
        pagination.put("totalPages", posts.getTotalPages());
        pagination.put("hasPrevious", posts.hasPrevious());
        pagination.put("hasNext", posts.hasNext());
        fields.put("pagination", pagination);

        return ResponseEntity.ok(Map.of(
                "home", Map.of(
                        "path", "src/main/resources/templates/community/home.html",
                        "fields", fields
                )
        ));
    }

    @GetMapping("/community/write")
    public ResponseEntity<Map<String, Object>> writeForm(@AuthenticationPrincipal User user) {
        Map<String, Object> fields = new HashMap<>();

        // 권한에 따른 카테고리 필터링
        List<String> categories;
        if (user.getRole() != Role.ADMIN) {
            categories = Arrays.stream(PostCategory.values())
                    .filter(category -> category != PostCategory.NOTICE)
                    .map(PostCategory::getValue)
                    .collect(Collectors.toList());
        } else {
            categories = Arrays.stream(PostCategory.values())
                    .map(PostCategory::getValue)
                    .collect(Collectors.toList());
        }

        fields.put("categories", categories);
        fields.put("disabilityTypes", Arrays.stream(DisabilityType.values())
                .map(DisabilityType::getValue)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(Map.of(
                "write", Map.of(
                        "path", "src/main/resources/templates/community/write.html",
                        "fields", fields
                )
        ));
    }

    @PostMapping("/community/write")
    public String write(
            @AuthenticationPrincipal User user,
            @ModelAttribute PostRequest request,
            RedirectAttributes redirectAttributes) {

        try {
            // PostService를 통해 게시글 저장
            Long postId = postService.createPost(user.getEmail(), request);
            redirectAttributes.addFlashAttribute("message", "게시글이 등록되었습니다.");
            return "redirect:/community/post/" + postId;
        } catch (Exception e) {
            // 예외 발생 시 에러 메시지를 담아서 글쓰기 페이지로 리다이렉트
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/community/write";
        }
    }




    @GetMapping("/community/post/{id}")
    public ResponseEntity<Map<String, Object>> detail(
            @PathVariable Long id,
            @RequestParam(required = false) String message,
            @RequestParam(required = false) String error,
            @RequestParam(required = false) DisabilityType fromBoard) {

        PostResponse post = postService.getPost(id);

        // LinkedHashMap을 사용하여 순서 보장
        Map<String, Object> fields = new LinkedHashMap<>();
        fields.put("message", message);
        fields.put("error", error);

        // post 정보
        Map<String, Object> postMap = new LinkedHashMap<>();
        postMap.put("id", post.getId());
        postMap.put("title", post.getTitle());
        postMap.put("content", post.getContent());
        postMap.put("category", post.getCategoryValue());
        postMap.put("disabilityType", post.getDisabilityTypeValue());
        postMap.put("authorName", post.getAuthorName());
        postMap.put("createdAt", post.getFormattedCreatedAt());

        // actions
        Map<String, String> actions = new LinkedHashMap<>();
        actions.put("edit", "/community/post/" + id + "/edit");
        actions.put("delete", "/community/post/" + id + "/delete");
        postMap.put("actions", actions);

        // comments
        List<Map<String, Object>> commentsMap = post.getComments().stream()
                .map(comment -> {
                    Map<String, Object> commentMap = new LinkedHashMap<>();
                    commentMap.put("id", comment.getId());
                    commentMap.put("authorName", comment.getAuthorName());
                    commentMap.put("content", comment.getContent());
                    commentMap.put("createdAt", comment.getFormattedCreatedAt());

                    Map<String, String> commentActions = new LinkedHashMap<>();
                    commentActions.put("delete",
                            "/community/post/" + id + "/comment/" + comment.getId() + "/delete");
                    commentMap.put("actions", commentActions);

                    return commentMap;
                })
                .collect(Collectors.toList());
        postMap.put("comments", commentsMap);
        fields.put("post", postMap);

        // commentForm
        Map<String, Object> commentForm = new LinkedHashMap<>();
        commentForm.put("action", "/community/post/" + id + "/comment");
        commentForm.put("fields", Map.of("content", "String"));
        fields.put("commentForm", commentForm);

        // navigation
        Map<String, String> navigation = new LinkedHashMap<>();
        if (fromBoard != null) {
            navigation.put("backToList", "/community/" + fromBoard.name().toLowerCase());
        } else {
            navigation.put("backToList", "/community");
        }
        fields.put("navigation", navigation);

        Map<String, Object> detail = new LinkedHashMap<>();
        detail.put("path", "src/main/resources/templates/community/detail.html");
        detail.put("fields", fields);

        return ResponseEntity.ok(Map.of("detail", detail));
    }

    @GetMapping("/community/post/{id}/edit")
    public ResponseEntity<Map<String, Object>> editForm(@PathVariable Long id, @AuthenticationPrincipal User user) {
        PostResponse post = postService.getPost(id);

        if (!post.getAuthorName().equals(user.getName())) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        Map<String, Object> fields = new HashMap<>();
        Map<String, Object> postMap = new HashMap<>();

        // post 정보 매핑
        postMap.put("id", post.getId());
        postMap.put("title", post.getTitle());
        postMap.put("content", post.getContent());
        postMap.put("category", post.getCategory().getValue());
        postMap.put("disabilityType", post.getDisabilityType().getValue());

        fields.put("post", postMap);
        fields.put("categories", Arrays.stream(PostCategory.values())
                .map(PostCategory::getValue)
                .collect(Collectors.toList()));
        fields.put("disabilityTypes", Arrays.stream(DisabilityType.values())
                .map(DisabilityType::getValue)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(Map.of(
                "edit", Map.of(
                        "path", "src/main/resources/templates/community/edit.html",
                        "fields", fields
                )
        ));
    }

    @PostMapping("/community/post/{id}/edit")
    public String edit(@PathVariable Long id,
                       @AuthenticationPrincipal User user,
                       @ModelAttribute PostRequest request,
                       RedirectAttributes redirectAttributes) {
        try {
            postService.updatePost(id, user.getEmail(), request);
            redirectAttributes.addFlashAttribute("message", "게시글이 수정되었습니다.");
            return "redirect:/community/post/" + id;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/community/post/" + id + "/edit";
        }
    }

    @DeleteMapping("/community/post/{id}/delete")
    public String delete(@PathVariable Long id,
                         @AuthenticationPrincipal User user,
                         RedirectAttributes redirectAttributes) {
        try {
            postService.deletePost(id, user.getEmail());
            redirectAttributes.addFlashAttribute("message", "게시글이 삭제되었습니다.");
            return "redirect:/community";
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
            return "redirect:/community/post/" + id;
        }


    }

    @PostMapping("/community/post/{postId}/comment")
    public String addComment(@PathVariable Long postId,
                             @AuthenticationPrincipal User user,
                             @ModelAttribute CommentRequest request,
                             RedirectAttributes redirectAttributes) {
        try {
            commentService.addComment(postId, user.getEmail(), request);
            redirectAttributes.addFlashAttribute("message", "댓글이 등록되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "댓글 등록 중 오류가 발생했습니다.");
        }
        return "redirect:/community/post/" + postId;
    }

    @PostMapping("/community/post/{postId}/comment/{commentId}/delete")
    public String deleteComment(@PathVariable Long postId,
                                @PathVariable Long commentId,
                                @AuthenticationPrincipal User user,
                                RedirectAttributes redirectAttributes) {
        try {
            commentService.deleteComment(commentId, user.getEmail());
            redirectAttributes.addFlashAttribute("message", "댓글이 삭제되었습니다.");
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", e.getMessage());
        }
        return "redirect:/community/post/" + postId;
    }

    @GetMapping("/community/search")
    public String search(@RequestParam String keyword,
                         @PageableDefault(size = 10) Pageable pageable,
                         Model model) {
        PageRequest pageRequest = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                Sort.by("createdAt").descending());

        model.addAttribute("posts", postService.searchPosts(keyword, pageRequest));
        model.addAttribute("keyword", keyword);
        return "community/home";
    }
}