package com.cinepass.mapper;

import com.cinepass.dto.ShowtimeDto;
import com.cinepass.entity.Showtime;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ShowtimeMapper {

    @Mapping(target = "movieId", source = "movie.id")
    @Mapping(target = "movieTitle", source = "movie.title")
    ShowtimeDto toDto(Showtime showtime);
}
