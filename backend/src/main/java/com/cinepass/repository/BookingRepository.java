package com.cinepass.repository;

import com.cinepass.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByBookingDateDesc(Long userId);
    boolean existsByShowtimeId(Long showtimeId);
}
