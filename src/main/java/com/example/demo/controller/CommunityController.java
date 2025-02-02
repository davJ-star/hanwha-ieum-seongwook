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
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@RestController  // JSON 응답을 위해 사용
@RequestMapping("/community")
@RequiredArgsConstructor
@Slf4j
public class CommunityController {

    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("")
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

    // 2. 글쓰기 폼에 필요한 데이터 조회 (예: 카테고리, 장애유형 목록)
    @GetMapping("/write")
    public ResponseEntity<?> writeForm(@AuthenticationPrincipal User user) {
        Map<String, Object> response = new HashMap<>();

        // 권한에 따른 카테고리 필터링
        List<String> categories;
        if (user.getRole() != Role.ADMIN) {
            categories = Arrays.stream(PostCategory.values())
                    .filter(cat -> cat != PostCategory.NOTICE)
                    .map(PostCategory::getValue)
                    .collect(Collectors.toList());
        } else {
            categories = Arrays.stream(PostCategory.values())
                    .map(PostCategory::getValue)
                    .collect(Collectors.toList());
        }
        response.put("categories", categories);
        response.put("disabilityTypes", Arrays.stream(DisabilityType.values())
                .map(DisabilityType::getValue)
                .collect(Collectors.toList()));

        return ResponseEntity.ok(response);
    }

    // 3. 게시글 작성 (POST)
    @PostMapping("/write")
    public ResponseEntity<?> write(@AuthenticationPrincipal User user,
                                   @RequestBody PostRequest request) {
        try {
            Long postId = postService.createPost(user.getEmail(), request);
            return ResponseEntity.ok(Map.of("id", postId, "message", "게시글이 등록되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 4. 게시글 상세 조회
    @GetMapping("/post/{id}")
    public ResponseEntity<?> detail(@PathVariable Long id,
                                    @RequestParam(required = false) DisabilityType fromBoard) {
        try {
            PostResponse post = postService.getPost(id);

            Map<String, Object> postMap = new LinkedHashMap<>();
            postMap.put("id", post.getId());
            postMap.put("title", post.getTitle());
            postMap.put("content", post.getContent());
            postMap.put("category", post.getCategoryValue());
            postMap.put("disabilityType", post.getDisabilityTypeValue());
            postMap.put("authorName", post.getAuthorName());
            postMap.put("createdAt", post.getFormattedCreatedAt());

            // action 정보(필요하다면)
            Map<String, String> actions = new LinkedHashMap<>();
            actions.put("edit", "/community/post/" + id + "/edit");
            actions.put("delete", "/community/post/" + id + "/delete");
            postMap.put("actions", actions);

            // 댓글 변환
            List<Map<String, Object>> comments = post.getComments().stream()
                    .map(comment -> {
                        Map<String, Object> commentMap = new LinkedHashMap<>();
                        commentMap.put("id", comment.getId());
                        commentMap.put("authorName", comment.getAuthorName());
                        commentMap.put("content", comment.getContent());
                        commentMap.put("createdAt", comment.getFormattedCreatedAt());
                        Map<String, String> commentActions = new LinkedHashMap<>();
                        commentActions.put("delete", "/community/post/" + id + "/comment/" + comment.getId() + "/delete");
                        commentMap.put("actions", commentActions);
                        return commentMap;
                    })
                    .collect(Collectors.toList());
            postMap.put("comments", comments);

            return ResponseEntity.ok(postMap);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 5. 게시글 수정 폼 데이터 조회 (게시글 상세 정보 + 수정에 필요한 데이터)
    @GetMapping("/post/{id}/edit")
    public ResponseEntity<?> editForm(@PathVariable Long id, @AuthenticationPrincipal User user) {
        try {
            PostResponse post = postService.getPost(id);
            if (!post.getAuthorName().equals(user.getName())) {
                return ResponseEntity.status(HttpStatus.FORBIDDEN)
                        .body(Map.of("error", "수정 권한이 없습니다."));
            }

            Map<String, Object> response = new HashMap<>();
            Map<String, Object> postMap = new HashMap<>();
            postMap.put("id", post.getId());
            postMap.put("title", post.getTitle());
            postMap.put("content", post.getContent());
            postMap.put("category", post.getCategory().getValue());
            postMap.put("disabilityType", post.getDisabilityType().getValue());
            response.put("post", postMap);
            response.put("categories", Arrays.stream(PostCategory.values())
                    .map(PostCategory::getValue)
                    .collect(Collectors.toList()));
            response.put("disabilityTypes", Arrays.stream(DisabilityType.values())
                    .map(DisabilityType::getValue)
                    .collect(Collectors.toList()));

            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 6. 게시글 수정 (PUT)
    @PutMapping("/post/{id}/edit")
    public ResponseEntity<?> edit(@PathVariable Long id,
                                  @AuthenticationPrincipal User user,
                                  @RequestBody PostRequest request) {
        try {
            postService.updatePost(id, user.getEmail(), request);
            return ResponseEntity.ok(Map.of("message", "게시글이 수정되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 7. 게시글 삭제 (DELETE)
    @DeleteMapping("/post/{id}/delete")
    public ResponseEntity<?> delete(@PathVariable Long id,
                                    @AuthenticationPrincipal User user) {
        try {
            postService.deletePost(id, user.getEmail());
            return ResponseEntity.ok(Map.of("message", "게시글이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 8. 댓글 작성 (POST)
    @PostMapping("/post/{postId}/comment")
    public ResponseEntity<?> addComment(@PathVariable Long postId,
                                        @AuthenticationPrincipal User user,
                                        @RequestBody CommentRequest request) {
        try {
            commentService.addComment(postId, user.getEmail(), request);
            return ResponseEntity.ok(Map.of("message", "댓글이 등록되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", "댓글 등록 중 오류가 발생했습니다."));
        }
    }

    // 9. 댓글 삭제 (DELETE)
    @DeleteMapping("/post/{postId}/comment/{commentId}/delete")
    public ResponseEntity<?> deleteComment(@PathVariable Long postId,
                                           @PathVariable Long commentId,
                                           @AuthenticationPrincipal User user) {
        try {
            commentService.deleteComment(commentId, user.getEmail());
            return ResponseEntity.ok(Map.of("message", "댓글이 삭제되었습니다."));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    // 10. 게시글 검색 (GET)
    @GetMapping("/search")
    public ResponseEntity<?> search(@RequestParam String keyword,
                                    @PageableDefault(size = 10) Pageable pageable) {
        try {
            PageRequest pageRequest = PageRequest.of(
                    pageable.getPageNumber(),
                    pageable.getPageSize(),
                    Sort.by("createdAt").descending());

            Page<PostResponse> posts = postService.searchPosts(keyword, pageRequest);
            Map<String, Object> response = new HashMap<>();
            response.put("posts", posts.getContent());
            response.put("keyword", keyword);
            response.put("currentPage", posts.getNumber());
            response.put("totalPages", posts.getTotalPages());
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                    .body(Map.of("error", e.getMessage()));
        }
    }

    @GetMapping("/{disabilityType}")
    public ResponseEntity<Map<String, Object>> getCommunityByType(
            @PathVariable(name = "disabilityType") String disabilityTypeStr,  // String으로 받고
            @RequestParam(required = false) PostCategory category,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC) Pageable pageable) {

        // String을 DisabilityType으로 변환
        DisabilityType disabilityType;
        try {
            disabilityType = DisabilityType.valueOf(disabilityTypeStr);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(Map.of(
                    "message", "Invalid disability type: " + disabilityTypeStr
            ));
        }

        log.info("Getting posts for disability type: {}", disabilityType);

        Page<PostResponse> posts = postService.getPostsByDisabilityType(disabilityType, category, pageable);

        Map<String, Object> fields = new HashMap<>();

        // 선택적 필드 추가
        fields.put("disabilityType", disabilityType.getValue());
        if (category != null) {
            fields.put("category", category.getValue());
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
}
