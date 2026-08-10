package com.cinepass.repository;

import com.cinepass.entity.Showtime;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ShowtimeRepository extends JpaRepository<Showtime, Long> {
    List<Showtime> findByMovieIdOrderByShowDateAscShowTimeAsc(Long movieId);
    List<Showtime> findAllByOrderByShowDateAscShowTimeAsc();
    boolean existsByMovieId(Long movieId);
}
