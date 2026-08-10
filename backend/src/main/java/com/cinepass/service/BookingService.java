package com.cinepass.service;

import com.cinepass.dto.BookingRequest;
import com.cinepass.dto.BookingResponse;
import com.cinepass.entity.*;
import com.cinepass.exception.BadRequestException;
import com.cinepass.exception.ResourceNotFoundException;
import com.cinepass.repository.BookingRepository;
import com.cinepass.repository.BookingSeatRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final ShowtimeService showtimeService;

    @Transactional
    public BookingResponse createBooking(User user, BookingRequest request) {
        Showtime showtime = showtimeService.findShowtimeOrThrow(request.showtimeId());

        // De-duplicate and validate every requested seat is a real seat on the layout.
        Set<String> requestedSeats = new HashSet<>(request.seatCodes());
        if (requestedSeats.size() > 6) {
            throw new BadRequestException("Maximum 6 seats can be booked at once");
        }
        for (String seat : requestedSeats) {
            if (!ShowtimeService.ALL_SEAT_CODES.contains(seat)) {
                throw new BadRequestException("Invalid seat code: " + seat);
            }
        }

        // Re-check availability inside the transaction to guard against a race
        // between two people booking the same seat at nearly the same time.
        List<String> alreadyBooked = bookingSeatRepository.findActiveSeatCodesByShowtimeId(showtime.getId());
        for (String seat : requestedSeats) {
            if (alreadyBooked.contains(seat)) {
                throw new BadRequestException("Seat " + seat + " has already been booked");
            }
        }

        Booking booking = Booking.builder()
                .user(user)
                .showtime(showtime)
                .status(BookingStatus.CONFIRMED)
                .build();

        for (String seat : requestedSeats) {
            booking.getSeats().add(BookingSeat.builder()
                    .booking(booking)
                    .seatCode(seat)
                    .showtimeIdSnapshot(showtime.getId())
                    .build());
        }

        Booking saved = bookingRepository.save(booking);
        return toResponse(saved);
    }

    public List<BookingResponse> getBookingsForUser(Long userId) {
        return bookingRepository.findByUserIdOrderByBookingDateDesc(userId).stream()
                .map(this::toResponse)
                .toList();
    }

    @Transactional
    public void cancelBooking(Long userId, boolean isAdmin, Long bookingId) {
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with id: " + bookingId));

        if (!isAdmin && !booking.getUser().getId().equals(userId)) {
            throw new BadRequestException("You can only cancel your own bookings");
        }

        if (booking.getStatus() == BookingStatus.CANCELLED) {
            throw new BadRequestException("This booking is already cancelled");
        }

        booking.setStatus(BookingStatus.CANCELLED);
        bookingRepository.save(booking);
    }

    private BookingResponse toResponse(Booking booking) {
        Showtime showtime = booking.getShowtime();
        List<String> seatCodes = booking.getSeats().stream().map(BookingSeat::getSeatCode).sorted().toList();
        BigDecimal total = showtime.getTicketPrice().multiply(BigDecimal.valueOf(seatCodes.size()));

        return new BookingResponse(
                booking.getId(),
                showtime.getId(),
                showtime.getMovie().getTitle(),
                showtime.getMovie().getPosterUrl(),
                showtime.getTheatreName(),
                showtime.getShowDate(),
                showtime.getShowTime(),
                seatCodes,
                total,
                booking.getStatus(),
                booking.getBookingDate()
        );
    }
}
