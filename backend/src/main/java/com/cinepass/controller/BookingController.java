package com.cinepass.controller;

import com.cinepass.dto.BookingRequest;
import com.cinepass.dto.BookingResponse;
import com.cinepass.entity.User;
import com.cinepass.repository.UserRepository;
import com.cinepass.security.UserPrincipal;
import com.cinepass.service.BookingService;
import io.swagger.v3.oas.annotations.tags.Tag;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@RequiredArgsConstructor
@Tag(name = "Bookings")
public class BookingController {

    private final BookingService bookingService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<BookingResponse> createBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @Valid @RequestBody BookingRequest request
    ) {
        User user = userRepository.getReferenceById(principal.getId());
        return ResponseEntity.status(HttpStatus.CREATED).body(bookingService.createBooking(user, request));
    }

    @GetMapping("/mine")
    public ResponseEntity<List<BookingResponse>> getMyBookings(@AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(bookingService.getBookingsForUser(principal.getId()));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> cancelBooking(
            @AuthenticationPrincipal UserPrincipal principal,
            @PathVariable Long id
    ) {
        bookingService.cancelBooking(principal.getId(), principal.isAdmin(), id);
        return ResponseEntity.noContent().build();
    }
}
