package com.cinepass.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "movies")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Movie {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String genre;

    /** Duration in minutes */
    @Column(nullable = false)
    private Integer duration;

    /** e.g. 4.5 out of 5, or a certification like "PG-13" depending on product choice - using numeric rating */
    @Column(nullable = false)
    private Double rating;

    @Column(name = "poster_url", length = 1000)
    private String posterUrl;

    @Column(length = 4000)
    private String synopsis;

    @Column(name = "cast_members", length = 2000)
    private String cast;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
