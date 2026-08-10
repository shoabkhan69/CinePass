package com.cinepass.controller;

import com.cinepass.dto.SeatMapDto;
import com.cinepass.dto.ShowtimeDto;
import com.cinepass.service.ShowtimeService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@Tag(name = "Showtimes")
public class ShowtimeController {

    private final ShowtimeService showtimeService;

    /** Admin-only: lists every showtime across all movies, for the admin management screen. */
    @GetMapping("/api/showtimes")
    public ResponseEntity<List<ShowtimeDto>> getAllShowtimes() {
        return ResponseEntity.ok(showtimeService.getAllShowtimes());
    }

    @GetMapping("/api/movies/{id}/showtimes")
    public ResponseEntity<List<ShowtimeDto>> getShowtimesByMovie(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getShowtimesByMovie(id));
    }

    @GetMapping("/api/showtimes/{id}/seats")
    public ResponseEntity<SeatMapDto> getSeatMap(@PathVariable Long id) {
        return ResponseEntity.ok(showtimeService.getSeatMap(id));
    }

    @PostMapping("/api/showtimes")
    public ResponseEntity<ShowtimeDto> createShowtime(@Valid @RequestBody ShowtimeDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(showtimeService.createShowtime(dto));
    }

    @DeleteMapping("/api/showtimes/{id}")
    public ResponseEntity<Void> deleteShowtime(@PathVariable Long id) {
        showtimeService.deleteShowtime(id);
        return ResponseEntity.noContent().build();
    }
}
