package com.cinepass.exception;

import java.time.LocalDateTime;
import java.util.Map;

public record ErrorResponse(
        LocalDateTime timestamp,
        String path,
        String error,
        String message,
        Map<String, String> fieldErrors
) {
    public ErrorResponse(String path, String error, String message) {
        this(LocalDateTime.now(), path, error, message, null);
    }

    public ErrorResponse(String path, String error, String message, Map<String, String> fieldErrors) {
        this(LocalDateTime.now(), path, error, message, fieldErrors);
    }
}
