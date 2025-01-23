package com.example.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class Search {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "entpName")
    private String entpName;

    @Column(name = "itemName",unique = true)
    private String itemName;

    @Column(name = "efcyQesitm")
    private String efcyQesitm;
}
