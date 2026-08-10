package com.cinepass.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalTime;
import java.math.BigDecimal;

@Entity
@Table(name = "showtimes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Showtime {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "movie_id", nullable = false)
    private Movie movie;

    @Column(name = "theatre_name", nullable = false)
    private String theatreName;

    @Column(name = "show_date", nullable = false)
    private LocalDate showDate;

    @Column(name = "show_time", nullable = false)
    private LocalTime showTime;

    @Column(name = "ticket_price", nullable = false, precision = 10, scale = 2)
    private BigDecimal ticketPrice;
}
