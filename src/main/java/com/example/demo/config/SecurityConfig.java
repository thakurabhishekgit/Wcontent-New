package com.example.demo.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.Arrays;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            // 1. Disable CSRF for stateless REST API
            .csrf(csrf -> csrf.disable())
            // 2. Configure CORS at the security level
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            // 3. Define authorization rules
            .authorizeHttpRequests(authz -> authz
                // Allow all requests to these public endpoints
                .requestMatchers(
                    "/api/users/login",
                    "/api/users/register",
                    "/api/users/request-otp",
                    "/api/users/verify-otp",
                    "/api/users/google-auth",
                    "/api/users/opportunities/opportunitiesGetAll", // Publicly viewable
                    "/api/users/collabration/getCollabOfAllUsers"  // Publicly viewable
                ).permitAll()
                // All other requests must be authenticated (this will be enforced once JWT filter is added)
                .anyRequest().permitAll() // Temporarily permit all to avoid blocking during setup
            )
            // 4. Set session management to stateless
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
            
        // In a real JWT implementation, you would add a JWT filter here that protects endpoints
        // For now, we are permitting all requests until the JWT filter is in place.

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        // Add your frontend origins here
        configuration.setAllowedOrigins(Arrays.asList(
            "https://wcontent-app-in.vercel.app",
            "http://localhost:9002",
            "https://6000-idx-studio-1746278215655.cluster-73qgvk7hjjadkrjeyexca5ivva.cloudworkstations.dev"
        ));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(Arrays.asList("*"));
        configuration.setAllowCredentials(true);
        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
