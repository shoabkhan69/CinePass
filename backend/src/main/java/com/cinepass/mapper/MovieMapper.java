package com.cinepass.mapper;

import com.cinepass.dto.MovieDto;
import com.cinepass.entity.Movie;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;
import org.mapstruct.ReportingPolicy;

@Mapper(
        componentModel = "spring",
        unmappedTargetPolicy = ReportingPolicy.IGNORE,
        nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE
)
public interface MovieMapper {

    MovieDto toDto(Movie movie);

    Movie toEntity(MovieDto dto);

    void updateEntityFromDto(MovieDto dto, @MappingTarget Movie entity);
}
