package com.example.demo.controller;

import com.wcontent.service.EmailService;
import com.example.demo.MailTest.OTPService;
import com.example.demo.dto.TokenResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.example.demo.utils.JwtUtil;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private EmailService emailService;
    @Autowired
    private OTPService otpService;

    @GetMapping("/getAll")
    public Iterable<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/getAlll")
    public Iterable<User> getAllUserss() {
        return userRepository.findAll();
    }

    @PostMapping("/request-otp")
    public ResponseEntity<?> requestOTP(@RequestParam String email) {
        if (userRepository.existsByEmail(email)) {
            return new ResponseEntity<>("User with email " + email + " already exists", HttpStatus.CONFLICT);
        }
        String otp = otpService.generateOTP();
        otpService.sendOTPEmail(email, otp);
        otpService.storeOTP(email, otp);
        return new ResponseEntity<>(
                "OTP sent to your email for verification. Please check your inbox.",
                HttpStatus.OK);
    }

    @PostMapping("/verify-otp")
    public ResponseEntity<?> verifyOTP(@RequestParam String email, @RequestParam String otp) {
        boolean isValid = otpService.validateOTP(email, otp);
        if (!isValid) {
            return new ResponseEntity<>("Invalid or expired OTP", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>("OTP verified successfully. Proceed to registration.", HttpStatus.OK);
    }

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@RequestBody User user) {
        if (user.getUsername() == null || user.getUsername().isEmpty()) {
            return new ResponseEntity<>("Username is required", HttpStatus.BAD_REQUEST);
        }
        if (user.getPassword() == null || user.getPassword().isEmpty()) {
            return new ResponseEntity<>("Password is required", HttpStatus.BAD_REQUEST);
        }
        if (user.getEmail() == null || user.getEmail().isEmpty()) {
            return new ResponseEntity<>("Email is required", HttpStatus.BAD_REQUEST);
        }
        if (user.getUserType() == null || user.getUserType().isEmpty()) {
            return new ResponseEntity<>("User type is required", HttpStatus.BAD_REQUEST);
        }

        if ("ChannelOwner".equals(user.getUserType())) {
            if (user.getChannelId() == null || user.getChannelId().isEmpty()) {
                return new ResponseEntity<>("Channel ID is required for Channel Owners", HttpStatus.BAD_REQUEST);
            }
            if (user.getChannelName() == null || user.getChannelName().isEmpty()) {
                return new ResponseEntity<>("Channel Name is required for Channel Owners", HttpStatus.BAD_REQUEST);
            }
            if (user.getChannelURL() == null || user.getChannelURL().isEmpty()) {
                return new ResponseEntity<>("Channel URL is required for Channel Owners", HttpStatus.BAD_REQUEST);
            }
        }

        if (userRepository.existsByEmail(user.getEmail())) {
            return new ResponseEntity<>("User with email " + user.getEmail() + " already exists", HttpStatus.CONFLICT);
        }

        user.setVerified(true);
        User savedUser = userRepository.save(user);

        emailService.sendWelcomeEmail(savedUser.getEmail());

        String token = JwtUtil.generateToken(user.getEmail());
        TokenResponse tokenResponse = new TokenResponse(savedUser, token);
        return new ResponseEntity<>(tokenResponse, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> loginUser(@RequestBody User user) {
        User existingUser = userRepository.findByEmail(user.getEmail()).orElse(null);

        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }

        String storedPassword = existingUser.getPassword();
        String inputPassword = user.getPassword();

        if (storedPassword == null || inputPassword == null || !storedPassword.equals(inputPassword)) {
            return new ResponseEntity<>("Invalid password", HttpStatus.UNAUTHORIZED);
        }

        String token = JwtUtil.generateToken(existingUser.getEmail());
        TokenResponse tokenResponse = new TokenResponse(existingUser, token);

        return new ResponseEntity<>(tokenResponse, HttpStatus.OK);
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<?> updateUser(@PathVariable String id, @RequestBody User user) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        existingUser.setUsername(user.getUsername());
        existingUser.setPassword(user.getPassword());
        existingUser.setEmail(user.getEmail());
        existingUser.setUserType(user.getUserType());
        existingUser.setChannelName(user.getChannelName());
        existingUser.setChannelId(user.getChannelId());
        existingUser.setChannelURL(user.getChannelURL());
        User updatedUser = userRepository.save(existingUser);
        return new ResponseEntity<>(updatedUser, HttpStatus.OK);
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteUser(@PathVariable String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        userRepository.delete(existingUser);
        return new ResponseEntity<>("User deleted successfully", HttpStatus.OK);
    }

    @GetMapping("/getUser/{id}")
    public ResponseEntity<?> getUser(@PathVariable String id) {
        User existingUser = userRepository.findById(id).orElse(null);
        if (existingUser == null) {
            return new ResponseEntity<>("User not found", HttpStatus.NOT_FOUND);
        }
        return new ResponseEntity<>(existingUser, HttpStatus.OK);
    }
}
