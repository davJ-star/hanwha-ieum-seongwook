package com.example.demo.controller;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
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
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.mvc.support.RedirectAttributes;

@Controller
@RequiredArgsConstructor
@Slf4j
public class CommunityController {
    private final PostService postService;
    private final CommentService commentService;

    @GetMapping("/community")
    public String communityHome(@RequestParam(required = false) PostCategory category,
                                @RequestParam(required = false) DisabilityType disabilityType,
                                @PageableDefault(size = 10, sort = "createdAt",
                                        direction = Sort.Direction.DESC) Pageable pageable,
                                Model model) {
        Page<PostResponse> posts = postService.getPosts(category, disabilityType, pageable);
        model.addAttribute("posts", posts);
        model.addAttribute("categories", PostCategory.values());
        model.addAttribute("disabilityTypes", DisabilityType.values());
        return "community/home";
    }

    @GetMapping("/community/write")
    public String writeForm(Model model) {
        model.addAttribute("categories", PostCategory.values());
        model.addAttribute("disabilityTypes", DisabilityType.values());
        return "community/write";
    }

    @PostMapping("/community/write")
    public String write(@AuthenticationPrincipal User user,
                        @ModelAttribute PostRequest request,
                        RedirectAttributes redirectAttributes) {
        try {
            Long postId = postService.createPost(user.getEmail(), request);
            return "redirect:/community/post/" + postId;
        } catch (Exception e) {
            redirectAttributes.addFlashAttribute("error", "게시글 작성 중 오류가 발생했습니다.");
            return "redirect:/community/write";
        }
    }

    @GetMapping("/community/post/{id}")
    public String detail(@PathVariable Long id, Model model) {
        PostResponse post = postService.getPost(id);
        model.addAttribute("post", post);
        return "community/detail";
    }

    @GetMapping("/community/post/{id}/edit")
    public String editForm(@PathVariable Long id,
                           @AuthenticationPrincipal User user,
                           Model model) {
        PostResponse post = postService.getPost(id);

        if (!post.getAuthorName().equals(user.getName())) {
            throw new RuntimeException("수정 권한이 없습니다.");
        }

        model.addAttribute("post", post);
        model.addAttribute("categories", PostCategory.values());
        model.addAttribute("disabilityTypes", DisabilityType.values());
        return "community/edit";
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