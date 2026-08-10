package com.cinepass.config;

import com.cinepass.security.CustomUserDetailsService;
import com.cinepass.security.JwtAuthFilter;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    private final CustomUserDetailsService userDetailsService;
    private final JwtAuthFilter jwtAuthFilter;

    @Value("${cinepass.cors.allowed-origins}")
    private String allowedOrigins;

    private final ObjectMapper objectMapper = new ObjectMapper().findAndRegisterModules();

    private AuthenticationEntryPoint jsonAuthEntryPoint() {
        return (request, response, authException) -> writeJsonError(
                response, HttpStatus.UNAUTHORIZED, request.getRequestURI(), "Authentication is required to access this resource"
        );
    }

    private AccessDeniedHandler jsonAccessDeniedHandler() {
        return (request, response, accessDeniedException) -> writeJsonError(
                response, HttpStatus.FORBIDDEN, request.getRequestURI(), "You do not have permission to perform this action"
        );
    }

    private void writeJsonError(jakarta.servlet.http.HttpServletResponse response, HttpStatus status, String path, String message)
            throws java.io.IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);
        Map<String, Object> body = Map.of(
                "timestamp", LocalDateTime.now().toString(),
                "path", path,
                "error", status.getReasonPhrase(),
                "message", message
        );
        response.getWriter().write(objectMapper.writeValueAsString(body));
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public DaoAuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config) throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of(allowedOrigins.split(",")));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(csrf -> csrf.disable())
                .sessionManagement(sm -> sm.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
                .authorizeHttpRequests(auth -> auth
                        .requestMatchers("/api/auth/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/movies/**").permitAll()
                        .requestMatchers(HttpMethod.GET, "/api/showtimes").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.GET, "/api/showtimes/**").permitAll()
                        .requestMatchers(
                                "/swagger-ui/**", "/swagger-ui.html", "/v3/api-docs/**", "/h2-console/**"
                        ).permitAll()
                        .requestMatchers(HttpMethod.POST, "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.PUT, "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/movies/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.POST, "/api/showtimes/**").hasRole("ADMIN")
                        .requestMatchers(HttpMethod.DELETE, "/api/showtimes/**").hasRole("ADMIN")
                        .anyRequest().authenticated()
                )
                .headers(headers -> headers.frameOptions(frame -> frame.sameOrigin())) // allow H2 console frame
                .exceptionHandling(ex -> ex
                        .authenticationEntryPoint(jsonAuthEntryPoint())
                        .accessDeniedHandler(jsonAccessDeniedHandler())
                )
                .authenticationProvider(authenticationProvider())
                .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }
}
