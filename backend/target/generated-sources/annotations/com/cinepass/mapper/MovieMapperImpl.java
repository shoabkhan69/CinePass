package com.cinepass.mapper;

import com.cinepass.dto.MovieDto;
import com.cinepass.entity.Movie;
import javax.annotation.processing.Generated;
import org.springframework.stereotype.Component;

@Generated(
    value = "org.mapstruct.ap.MappingProcessor",
    date = "2026-08-10T13:43:02+0530",
    comments = "version: 1.6.0, compiler: Eclipse JDT (IDE) 3.46.100.v20260624-0231, environment: Java 21.0.11 (Eclipse Adoptium)"
)
@Component
public class MovieMapperImpl implements MovieMapper {

    @Override
    public MovieDto toDto(Movie movie) {
        if ( movie == null ) {
            return null;
        }

        Long id = null;
        String title = null;
        String genre = null;
        Integer duration = null;
        Double rating = null;
        String posterUrl = null;
        String synopsis = null;
        String cast = null;

        id = movie.getId();
        title = movie.getTitle();
        genre = movie.getGenre();
        duration = movie.getDuration();
        rating = movie.getRating();
        posterUrl = movie.getPosterUrl();
        synopsis = movie.getSynopsis();
        cast = movie.getCast();

        MovieDto movieDto = new MovieDto( id, title, genre, duration, rating, posterUrl, synopsis, cast );

        return movieDto;
    }

    @Override
    public Movie toEntity(MovieDto dto) {
        if ( dto == null ) {
            return null;
        }

        Movie.MovieBuilder movie = Movie.builder();

        movie.cast( dto.cast() );
        movie.duration( dto.duration() );
        movie.genre( dto.genre() );
        movie.id( dto.id() );
        movie.posterUrl( dto.posterUrl() );
        movie.rating( dto.rating() );
        movie.synopsis( dto.synopsis() );
        movie.title( dto.title() );

        return movie.build();
    }

    @Override
    public void updateEntityFromDto(MovieDto dto, Movie entity) {
        if ( dto == null ) {
            return;
        }

        if ( dto.cast() != null ) {
            entity.setCast( dto.cast() );
        }
        if ( dto.duration() != null ) {
            entity.setDuration( dto.duration() );
        }
        if ( dto.genre() != null ) {
            entity.setGenre( dto.genre() );
        }
        if ( dto.id() != null ) {
            entity.setId( dto.id() );
        }
        if ( dto.posterUrl() != null ) {
            entity.setPosterUrl( dto.posterUrl() );
        }
        if ( dto.rating() != null ) {
            entity.setRating( dto.rating() );
        }
        if ( dto.synopsis() != null ) {
            entity.setSynopsis( dto.synopsis() );
        }
        if ( dto.title() != null ) {
            entity.setTitle( dto.title() );
        }
    }
}
