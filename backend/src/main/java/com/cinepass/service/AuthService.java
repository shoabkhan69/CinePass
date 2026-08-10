package com.cinepass.service;

import com.cinepass.dto.auth.AuthResponse;
import com.cinepass.dto.auth.LoginRequest;
import com.cinepass.dto.auth.RegisterRequest;
import com.cinepass.entity.User;
import com.cinepass.exception.BadRequestException;
import com.cinepass.repository.UserRepository;
import com.cinepass.security.JwtService;
import com.cinepass.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final AuthenticationManager authenticationManager;

    @Transactional
    public AuthResponse register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.email())) {
            throw new BadRequestException("An account with this email already exists");
        }

        User user = User.builder()
                .name(request.name())
                .email(request.email().toLowerCase())
                .password(passwordEncoder.encode(request.password()))
                .isAdmin(false)
                .build();

        User saved = userRepository.save(user);
        UserPrincipal principal = new UserPrincipal(saved);
        String token = jwtService.generateToken(principal, saved.getId(), saved.isAdmin());

        return new AuthResponse(token, saved.getId(), saved.getName(), saved.getEmail(), saved.isAdmin());
    }

    public AuthResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email().toLowerCase(), request.password())
        );

        User user = userRepository.findByEmail(request.email().toLowerCase())
                .orElseThrow(() -> new BadRequestException("Invalid email or password"));

        UserPrincipal principal = new UserPrincipal(user);
        String token = jwtService.generateToken(principal, user.getId(), user.isAdmin());

        return new AuthResponse(token, user.getId(), user.getName(), user.getEmail(), user.isAdmin());
    }
}
