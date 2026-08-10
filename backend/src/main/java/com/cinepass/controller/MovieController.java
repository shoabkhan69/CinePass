package com.cinepass.controller;

import com.cinepass.dto.MovieDto;
import com.cinepass.service.MovieService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/movies")
@RequiredArgsConstructor
@Tag(name = "Movies")
public class MovieController {

    private final MovieService movieService;

    @GetMapping
    public ResponseEntity<List<MovieDto>> getAllMovies() {
        return ResponseEntity.ok(movieService.getAllMovies());
    }

    @GetMapping("/{id}")
    public ResponseEntity<MovieDto> getMovieById(@PathVariable Long id) {
        return ResponseEntity.ok(movieService.getMovieById(id));
    }

    @PostMapping
    public ResponseEntity<MovieDto> createMovie(@Valid @RequestBody MovieDto dto) {
        return ResponseEntity.status(HttpStatus.CREATED).body(movieService.createMovie(dto));
    }

    @PutMapping("/{id}")
    public ResponseEntity<MovieDto> updateMovie(@PathVariable Long id, @Valid @RequestBody MovieDto dto) {
        return ResponseEntity.ok(movieService.updateMovie(id, dto));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteMovie(@PathVariable Long id) {
        movieService.deleteMovie(id);
        return ResponseEntity.noContent().build();
    }
}
