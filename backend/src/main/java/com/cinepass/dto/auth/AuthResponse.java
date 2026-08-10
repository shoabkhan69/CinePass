package com.cinepass.dto.auth;

public record AuthResponse(
        String token,
        Long userId,
        String name,
        String email,
        boolean isAdmin
) {
}
