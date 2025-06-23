package com.example.freshmart_user.controller;

import com.example.freshmart_user.entity.User;
import com.example.freshmart_user.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.List;
import java.util.Map;

@RestController
@CrossOrigin
public class UserController {

    @Autowired
    public UserService userService;

    @PostMapping(path = "users")
    public User createUser(@RequestBody User user){
        return userService.createUser(user);
    }


    /*@GetMapping(path = "users")
    public List<User> getUsers(){
        return userService.getUsers();
    }*/
    @PutMapping(path = "users/{user_id}")
    public User updateUser(@PathVariable int user_id,@RequestBody User user){
        return userService.updateUser(user_id, user);
    }
    @DeleteMapping(path = "users/{user_id}")
    public String deleteUser(@PathVariable int user_id){
        return userService.deleteUser(user_id);
    }
    @GetMapping(path = "users")
    public List<User> getAllUsers(){
        return userService.getAllUsers();
    }
    @GetMapping(path = "users/{user_id}")
    public User getUserById(@PathVariable int user_id){
        return userService.getUserById(user_id);
    }

    @PostMapping("/login")
    public ResponseEntity<Map<String, Object>> login(@RequestBody Map<String, String> credentials) {
        String email = credentials.get("email");
        String password = credentials.get("password");

        Map<String, Object> userDetails = userService.checkUserCredentials(email, password);

        if (userDetails != null) {
            return ResponseEntity.ok(userDetails);  // Return user_id and user_role
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Collections.singletonMap("message", "Invalid credentials"));
        }
    }

    //update password
    @PostMapping("/forgot-password")
    public ResponseEntity<String> forgotPassword(@RequestParam("email") String email,
                                                 @RequestParam("password") String newPassword) {
        boolean updated = userService.updatePassword(email, newPassword);

        if (updated) {
            return ResponseEntity.ok("Password updated successfully");
        } else {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error resetting password. Ensure email exists.");
        }
    }

}
