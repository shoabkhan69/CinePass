package com.cinepass.mapper;

import com.cinepass.dto.ShowtimeDto;
import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-10T13:43:02+0530",
    comments = "version: 1.6.0, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class ShowtimeMapperImpl implements ShowtimeMapper {

    @Override
    public ShowtimeDto toDto(Showtime showtime) {
        if ( showtime == null ) {
            return null;
        }

        Long movieId = null;
        String movieTitle = null;
        Long id = null;
        String theatreName = null;
        LocalDate showDate = null;
        LocalTime showTime = null;
        BigDecimal ticketPrice = null;

        movieId = showtimeMovieId( showtime );
        movieTitle = showtimeMovieTitle( showtime );
        id = showtime.getId();
        theatreName = showtime.getTheatreName();
        showDate = showtime.getShowDate();
        showTime = showtime.getShowTime();
        ticketPrice = showtime.getTicketPrice();

        ShowtimeDto showtimeDto = new ShowtimeDto( id, movieId, movieTitle, theatreName, showDate, showTime, ticketPrice );

        return showtimeDto;
    }

    private Long showtimeMovieId(Showtime showtime) {
        Movie movie = showtime.getMovie();
        if ( movie == null ) {
            return null;
        }
        return movie.getId();
    }

    private String showtimeMovieTitle(Showtime showtime) {
        Movie movie = showtime.getMovie();
        if ( movie == null ) {
            return null;
        }
        return movie.getTitle();
    }
}
