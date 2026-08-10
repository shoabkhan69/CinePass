package com.cinepass.service;

import com.cinepass.dto.MovieDto;
import com.cinepass.entity.Movie;
import com.cinepass.exception.BadRequestException;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.mapper.MovieMapper;
import com.cinepass.repository.MovieRepository;
import com.cinepass.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class MovieService {

    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;
    private final MovieMapper movieMapper;

    public List<MovieDto> getAllMovies() {
        return movieRepository.findAll().stream()
                .map(movieMapper::toDto)
                .toList();
    }

    public MovieDto getMovieById(Long id) {
        Movie movie = findMovieOrThrow(id);
        return movieMapper.toDto(movie);
    }

    @Transactional
    public MovieDto createMovie(MovieDto dto) {
        Movie movie = movieMapper.toEntity(dto);
        movie.setId(null);
        Movie saved = movieRepository.save(movie);
        return movieMapper.toDto(saved);
    }

    @Transactional
    public MovieDto updateMovie(Long id, MovieDto dto) {
        Movie movie = findMovieOrThrow(id);
        movieMapper.updateEntityFromDto(dto, movie);
        Movie saved = movieRepository.save(movie);
        return movieMapper.toDto(saved);
    }

    @Transactional
    public void deleteMovie(Long id) {
        Movie movie = findMovieOrThrow(id);
        if (showtimeRepository.existsByMovieId(id)) {
            throw new BadRequestException(
                    "Cannot delete a movie that still has showtimes scheduled. Remove its showtimes first.");
        }
        movieRepository.delete(movie);
    }

    Movie findMovieOrThrow(Long id) {
        return movieRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Movie not found with id: " + id));
    }
}
