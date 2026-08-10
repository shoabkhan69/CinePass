package com.cinepass.dto;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.util.List;

public record BookingRequest(
        @NotNull(message = "Showtime is required")
        Long showtimeId,

        @NotEmpty(message = "At least one seat must be selected")
        @Size(max = 6, message = "Maximum 6 seats can be booked at once")
        List<String> seatCodes
) {
}
