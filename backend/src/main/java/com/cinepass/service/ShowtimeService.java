package com.cinepass.service;

import com.cinepass.dto.SeatMapDto;
import com.cinepass.dto.ShowtimeDto;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.exception.BadRequestException;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.mapper.ShowtimeMapper;
import com.cinepass.repository.BookingRepository;
import com.cinepass.repository.BookingSeatRepository;
import com.cinepass.repository.ShowtimeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class ShowtimeService {

    /** 5 rows (A-E) x 10 seats = 50 total seats per showtime, per the seat layout spec. */
    public static final List<String> ALL_SEAT_CODES = buildSeatCodes();

    private final ShowtimeRepository showtimeRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final BookingRepository bookingRepository;
    private final ShowtimeMapper showtimeMapper;
    private final MovieService movieService;

    private static List<String> buildSeatCodes() {
        List<String> codes = new ArrayList<>();
        for (char row = 'A'; row <= 'E'; row++) {
            for (int seatNum = 1; seatNum <= 10; seatNum++) {
                codes.add(row + String.valueOf(seatNum));
            }
        }
        return List.copyOf(codes);
    }

    /** Used by the admin showtime management screen, which lists everything rather than one movie at a time. */
    public List<ShowtimeDto> getAllShowtimes() {
        return showtimeRepository.findAllByOrderByShowDateAscShowTimeAsc().stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    public List<ShowtimeDto> getShowtimesByMovie(Long movieId) {
        return showtimeRepository.findByMovieIdOrderByShowDateAscShowTimeAsc(movieId).stream()
                .map(showtimeMapper::toDto)
                .toList();
    }

    public SeatMapDto getSeatMap(Long showtimeId) {
        Showtime showtime = findShowtimeOrThrow(showtimeId);
        List<String> bookedSeats = bookingSeatRepository.findActiveSeatCodesByShowtimeId(showtime.getId());
        return new SeatMapDto(showtime.getId(), ALL_SEAT_CODES, bookedSeats);
    }

    @Transactional
    public ShowtimeDto createShowtime(ShowtimeDto dto) {
        Movie movie = movieService.findMovieOrThrow(dto.movieId());
        Showtime showtime = Showtime.builder()
                .movie(movie)
                .theatreName(dto.theatreName())
                .showDate(dto.showDate())
                .showTime(dto.showTime())
                .ticketPrice(dto.ticketPrice())
                .build();
        Showtime saved = showtimeRepository.save(showtime);
        return showtimeMapper.toDto(saved);
    }

    @Transactional
    public void deleteShowtime(Long id) {
        Showtime showtime = findShowtimeOrThrow(id);
        if (bookingRepository.existsByShowtimeId(id)) {
            throw new BadRequestException(
                    "Cannot delete a showtime that already has bookings against it.");
        }
        showtimeRepository.delete(showtime);
    }

    Showtime findShowtimeOrThrow(Long id) {
        return showtimeRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Showtime not found with id: " + id));
    }
}
