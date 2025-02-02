package com.example.demo.repository;

import com.example.demo.Enum.DisabilityType;
import com.example.demo.Enum.PostCategory;
import com.example.demo.entity.Post;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface PostRepository extends JpaRepository<Post, Long> {
    @Query("SELECT p FROM Post p JOIN FETCH p.author LEFT JOIN FETCH p.comments c LEFT JOIN FETCH c.author WHERE p.id = :id")
    Optional<Post> findByIdWithAuthorAndComments(@Param("id") Long id);

    Page<Post> findByCategory(PostCategory category, Pageable pageable);
    Page<Post> findByDisabilityType(DisabilityType disabilityType, Pageable pageable);
    Page<Post> findByCategoryAndDisabilityType(PostCategory category, DisabilityType disabilityType, Pageable pageable);
    Page<Post> findByTitleContainingOrContentContaining(String titleKeyword, String contentKeyword, Pageable pageable);


    Page<Post> findByDisabilityTypeAndCategory(DisabilityType disabilityType,
                                               PostCategory category,
                                               Pageable pageable);

    Page<Post> findByDisabilityTypeAndTitleContainingOrContentContaining(
            DisabilityType disabilityType,
            String titleKeyword,
            String contentKeyword,
            Pageable pageable
    );

}
