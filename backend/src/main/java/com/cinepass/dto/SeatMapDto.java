package com.cinepass.dto;

import java.util.List;

public record SeatMapDto(
        Long showtimeId,
        List<String> allSeats,
        List<String> bookedSeats
) {
}
