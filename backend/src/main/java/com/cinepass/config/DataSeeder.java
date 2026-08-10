package com.cinepass.config;

import com.cinepass.entity.Movie;
import com.cinepass.entity.Showtime;
import com.cinepass.entity.User;
import com.cinepass.repository.MovieRepository;
import com.cinepass.repository.ShowtimeRepository;
import com.cinepass.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Component
@RequiredArgsConstructor
public class DataSeeder implements CommandLineRunner {

    private final UserRepository userRepository;
    private final MovieRepository movieRepository;
    private final ShowtimeRepository showtimeRepository;
    private final PasswordEncoder passwordEncoder;

    private record SeedMovie(String title, String genre, int duration, double rating,
                              String posterUrl, String synopsis, String cast) {}

    @Override
    public void run(String... args) {
        if (userRepository.count() == 0) {
            seedAdmin();
        }
        if (movieRepository.count() == 0) {
            seedMoviesAndShowtimes();
        }
    }

    private void seedAdmin() {
        User admin = User.builder()
                .name("CinePass Admin")
                .email("admin@cinepass.com")
                .password(passwordEncoder.encode("Admin@123"))
                .isAdmin(true)
                .build();
        userRepository.save(admin);
    }

    private void seedMoviesAndShowtimes() {
        List<SeedMovie> seedMovies = List.of(
                new SeedMovie("Nebula Drift", "Sci-Fi", 142, 4.6,
                        "https://image.tmdb.org/t/p/w500/sample_nebula_drift.jpg",
                        "A salvage crew stumbles on a derelict ship carrying a signal that shouldn't exist, and a choice that could end or save a war they didn't know was happening.",
                        "Ava Solano, Marcus Reyes, Ken Ibarra"),
                new SeedMovie("The Last Ember", "Drama", 118, 4.3,
                        "https://image.tmdb.org/t/p/w500/sample_last_ember.jpg",
                        "In a town slowly losing its only industry, three generations of one family fight to keep the family forge alive.",
                        "Elena Marsh, Tobias Grant, Priya Anand"),
                new SeedMovie("Midnight Heist", "Action", 128, 4.1,
                        "https://image.tmdb.org/t/p/w500/sample_midnight_heist.jpg",
                        "A retired thief is pulled back for one last job when the only people she trusts are the ones who could turn on her.",
                        "Jonah Cole, Simone Park, Andre Wells"),
                new SeedMovie("Laugh Track", "Comedy", 101, 3.9,
                        "https://image.tmdb.org/t/p/w500/sample_laugh_track.jpg",
                        "A failing sitcom writer discovers his sarcastic AI writing assistant is funnier than he is, and more popular.",
                        "Riley Chen, Marcus Doyle, Nadia Farouk"),
                new SeedMovie("Whispers in the Pines", "Horror", 109, 4.0,
                        "https://image.tmdb.org/t/p/w500/sample_whispers_pines.jpg",
                        "Four friends on a camping trip realize the woods remember everyone who has ever gotten lost in them.",
                        "Grace Halloway, Sam Ito, Delroy Banks"),
                new SeedMovie("Paper Cranes", "Romance", 112, 4.4,
                        "https://image.tmdb.org/t/p/w500/sample_paper_cranes.jpg",
                        "Two strangers exchange one folded note a week for a year, never learning each other's names, until one stops arriving.",
                        "Mira Osei, Daniel Whitfield"),
                new SeedMovie("Iron Season", "Sports", 124, 4.2,
                        "https://image.tmdb.org/t/p/w500/sample_iron_season.jpg",
                        "A small-town wrestling coach with nothing left to prove takes on one more team of misfits before he retires.",
                        "Terrence Boyd, Luis Fernandez, Amaya Cross"),
                new SeedMovie("The Cartographer's Daughter", "Adventure", 135, 4.5,
                        "https://image.tmdb.org/t/p/w500/sample_cartographer.jpg",
                        "She inherits her late father's unfinished map of a continent that, according to every modern satellite, does not exist.",
                        "Isla Ferreira, Owen Bright, Kwame Asante"),
                new SeedMovie("Static", "Thriller", 106, 4.0,
                        "https://image.tmdb.org/t/p/w500/sample_static.jpg",
                        "A radio host taking late-night callers starts receiving calls from a number that was disconnected a decade ago.",
                        "Nora Vance, Desmond Okafor"),
                new SeedMovie("Sundown Motel", "Mystery", 115, 4.1,
                        "https://image.tmdb.org/t/p/w500/sample_sundown_motel.jpg",
                        "A detective investigating a cold case checks into the last motel her missing sister was seen at, forty years later.",
                        "Camille Duarte, Victor Lang, Reyna Kim")
        );

        List<String> theatres = List.of("CinePass Grand - Downtown", "CinePass IMAX - Riverside", "CinePass Lite - Uptown");
        List<LocalTime> times = List.of(LocalTime.of(11, 0), LocalTime.of(15, 30), LocalTime.of(19, 45), LocalTime.of(22, 15));

        int theatreIdx = 0;
        int timeIdx = 0;

        for (SeedMovie sm : seedMovies) {
            Movie movie = Movie.builder()
                    .title(sm.title())
                    .genre(sm.genre())
                    .duration(sm.duration())
                    .rating(sm.rating())
                    .posterUrl(sm.posterUrl())
                    .synopsis(sm.synopsis())
                    .cast(sm.cast())
                    .build();
            Movie savedMovie = movieRepository.save(movie);

            // 3 showtimes per movie across the next 3 days, rotating theatres/times
            for (int day = 0; day < 3; day++) {
                Showtime showtime = Showtime.builder()
                        .movie(savedMovie)
                        .theatreName(theatres.get(theatreIdx % theatres.size()))
                        .showDate(LocalDate.now().plusDays(day))
                        .showTime(times.get(timeIdx % times.size()))
                        .ticketPrice(BigDecimal.valueOf(220 + (day * 30)))
                        .build();
                showtimeRepository.save(showtime);
                theatreIdx++;
                timeIdx++;
            }
        }
    }
}
