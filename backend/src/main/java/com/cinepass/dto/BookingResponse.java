package com.cinepass.dto;

import com.cinepass.entity.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

public record BookingResponse(
        Long id,
        Long showtimeId,
        String movieTitle,
        String posterUrl,
        String theatreName,
        LocalDate showDate,
        LocalTime showTime,
        List<String> seatCodes,
        BigDecimal totalAmount,
        BookingStatus status,
        LocalDateTime bookingDate
) {
}
