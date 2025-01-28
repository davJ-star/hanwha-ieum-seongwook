package com.example.demo.service;

import com.example.demo.Enum.Role;
import com.example.demo.dto.CommentResponse;
import com.example.demo.dto.PostRequest;
import com.example.demo.dto.PostResponse;
import com.example.demo.entity.Comment;
import com.example.demo.entity.Post;
import com.example.demo.entity.User;
import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import com.example.demo.repository.PostRepository;
import com.example.demo.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@Transactional(readOnly = true)
@RequiredArgsConstructor
@Slf4j
public class PostService {
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    @Transactional
    public Long createPost(String email, PostRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

        if (request.getCategory() == PostCategory.NOTICE && user.getRole() != Role.ADMIN) {
            throw new RuntimeException("공지사항 작성 권한이 없습니다.");
        }

        Post post = Post.builder()
                .title(request.getTitle())
                .content(request.getContent())
                .category(request.getCategory())
                .disabilityType(request.getDisabilityType())
                .author(user)
                .build();

        return postRepository.save(post).getId();
    }

    public Page<PostResponse> getPosts(PostCategory category,
                                       DisabilityType disabilityType,
                                       Pageable pageable) {
        Page<Post> posts;

        if (category != null && disabilityType != null) {
            posts = postRepository.findByCategoryAndDisabilityType(
                    category, disabilityType, pageable);
        } else if (category != null) {
            posts = postRepository.findByCategory(category, pageable);
        } else if (disabilityType != null) {
            posts = postRepository.findByDisabilityType(disabilityType, pageable);
        } else {
            posts = postRepository.findAll(pageable);
        }

        return posts.map(this::convertToDto);
    }


    public PostResponse getPost(Long id) {
        Post post = postRepository.findByIdWithAuthorAndComments(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
        return convertToDto(post);
    }

    @Transactional
    public void updatePost(Long id, String email, PostRequest request) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("게시글 수정 권한이 없습니다.");
        }

        post.update(request.getTitle(), request.getContent(),
                request.getCategory(), request.getDisabilityType());
    }


    private PostResponse convertToDto(Post post) {
        return PostResponse.builder()
                .id(post.getId())
                .title(post.getTitle())
                .content(post.getContent())
                .authorName(post.getAuthor().getName())
                .category(post.getCategory())
                .disabilityType(post.getDisabilityType())
                .createdAt(post.getCreatedAt())
                .comments(post.getComments().stream()
                        .sorted(Comparator.comparing(Comment::getCreatedAt))
                        .map(this::convertToDto)
                        .collect(Collectors.toList()))
                .build();
    }

    private CommentResponse convertToDto(Comment comment) {
        return CommentResponse.builder()
                .id(comment.getId())
                .content(comment.getContent())
                .authorName(comment.getAuthor().getName())
                .createdAt(comment.getCreatedAt())
                .build();
    }

    @Transactional
    public void deletePost(Long id, String email) {
        Post post = postRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

        if (!post.getAuthor().getEmail().equals(email)) {
            throw new RuntimeException("게시글 삭제 권한이 없습니다.");
        }

        postRepository.delete(post);
    }




    public Page<PostResponse> searchPosts(String keyword, PageRequest pageRequest) {
        Page<Post> posts = postRepository.findByTitleContainingOrContentContaining(
                keyword, keyword, pageRequest);
        return posts.map(this::convertToDto);
    }
}