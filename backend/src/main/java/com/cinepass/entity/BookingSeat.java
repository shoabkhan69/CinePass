package com.cinepass.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "booking_seats")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingSeat {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    /** e.g. A1, B7, E10 */
    @Column(name = "seat_code", nullable = false, length = 4)
    private String seatCode;

    /**
     * Denormalized showtime id, kept in sync with booking.showtime.id at creation
     * time, so seat-availability queries don't need a join through Booking.
     * Availability is enforced in BookingService against CONFIRMED bookings only,
     * so a cancelled booking correctly frees its seats for re-booking.
     */
    @Column(name = "showtime_id_snapshot", nullable = false)
    private Long showtimeIdSnapshot;
}
