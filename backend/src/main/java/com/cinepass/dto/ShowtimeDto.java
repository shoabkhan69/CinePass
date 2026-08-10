package com.cinepass.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

public record ShowtimeDto(
        Long id,

        @NotNull(message = "Movie is required")
        Long movieId,

        String movieTitle,

        @NotBlank(message = "Theatre name is required")
        String theatreName,

        @NotNull(message = "Show date is required")
        LocalDate showDate,

        @NotNull(message = "Show time is required")
        LocalTime showTime,

        @NotNull(message = "Ticket price is required")
        @Positive(message = "Ticket price must be positive")
        BigDecimal ticketPrice
) {
}
