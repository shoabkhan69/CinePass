package com.cinepass.dto;

import jakarta.validation.constraints.*;

public record MovieDto(
        Long id,

        @NotBlank(message = "Title is required")
        String title,

        @NotBlank(message = "Genre is required")
        String genre,

        @NotNull(message = "Duration is required")
        @Positive(message = "Duration must be positive")
        Integer duration,

        @NotNull(message = "Rating is required")
        @DecimalMin(value = "0.0", message = "Rating must be at least 0")
        @DecimalMax(value = "5.0", message = "Rating must be at most 5")
        Double rating,

        String posterUrl,

        @NotBlank(message = "Synopsis is required")
        String synopsis,

        String cast
) {
}
