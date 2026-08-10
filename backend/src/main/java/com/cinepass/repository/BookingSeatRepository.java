package com.cinepass.repository;

import com.cinepass.entity.BookingSeat;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {

    @Query("""
        select bs.seatCode from BookingSeat bs
        where bs.showtimeIdSnapshot = :showtimeId
        and bs.booking.status = com.cinepass.entity.BookingStatus.CONFIRMED
    """)
    List<String> findActiveSeatCodesByShowtimeId(@Param("showtimeId") Long showtimeId);
}
