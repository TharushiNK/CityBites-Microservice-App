package com.example.freshmart_user.service;

import com.example.freshmart_user.entity.User;
import com.example.freshmart_user.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.namedparam.MapSqlParameterSource;
import org.springframework.jdbc.core.simple.SimpleJdbcCall;
import org.springframework.stereotype.Service;
import org.springframework.web.bind.annotation.RequestBody;

import java.awt.font.OpenType;
import java.sql.CallableStatement;
import java.sql.Connection;
import java.sql.ResultSet;
import java.sql.Types;
import java.util.*;

@Service
public class UserService {

    @Autowired
    public UserRepository userRepository;
    @Autowired
    public JdbcTemplate jdbcTemplate;

    public User createUser(User user) {
        return jdbcTemplate.execute((Connection conn) -> {
            // 1. Prepare the call to the stored procedure
            CallableStatement cs = conn.prepareCall("{CALL add_user(?, ?, ?, ?, ?)}");

            // 2. Set input parameters
            cs.setString(1, user.getUsername());
            cs.setString(2, user.getEmail());
            cs.setString(3, user.getPassword());
            cs.setString(4, user.getRole());

            // 3. Register output parameter for user_id
            cs.registerOutParameter(5, Types.INTEGER);

            // 4. Execute the procedure
            cs.execute();

            // 5. Get the generated user_id
            int generatedUserId = cs.getInt(5);
            user.setUser_id(generatedUserId);

            return user;
        });
    }


   /* public List<User> getUsers() {
        return userRepository.findAll();
    }*/

    public User updateUser(int user_id, User user) {
        jdbcTemplate.update("CALL update_user(?,?,?,?,?)",
                user_id,
                user.getUsername(),
                user.getEmail(),
                user.getPassword(),
                user.getRole());
        return user;
    }

    public String deleteUser(int user_id) {
        jdbcTemplate.update("CALL delete_user(?)",
                user_id);
        return "user deletion successful";
    }

    public List<User> getAllUsers() {
        // Simple call to PL/SQL procedure
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    CallableStatement cs = conn.prepareCall("{CALL get_all_users(?)}");
                    cs.registerOutParameter(1, Types.REF_CURSOR);
                    cs.execute();

                    // Auto-map results to User objects
                    try (ResultSet rs = (ResultSet) cs.getObject(1)) {
                        List<User> users = new ArrayList<>();
                        while (rs.next()) {
                            User user = new User();
                            user.setUser_id(rs.getInt("user_id"));
                            user.setUsername(rs.getString("user_name"));
                            user.setEmail(rs.getString("user_email"));
                            user.setPassword(rs.getString("user_password"));
                            user.setRole(rs.getString("user_role"));
                            users.add(user);
                        }
                        return users;
                    }
                }
        );
    }

    public User getUserById(int userId) {
        return jdbcTemplate.execute(
                (Connection conn) -> {
                    // Prepare the call with OUT parameters
                    CallableStatement cs = conn.prepareCall(
                            "{CALL get_user_by_id(?, ?, ?, ?, ?)}"
                    );

                    // Set IN parameter
                    cs.setInt(1, userId);

                    // Register OUT parameters
                    cs.registerOutParameter(2, Types.VARCHAR);  // p_name
                    cs.registerOutParameter(3, Types.VARCHAR);  // p_email
                    cs.registerOutParameter(4, Types.VARCHAR);  // p_password
                    cs.registerOutParameter(5, Types.VARCHAR);  // p_role

                    cs.execute();

                    // Create and populate User object
                    User user = new User();
                    user.setUser_id(userId);  // Set the ID we searched for
                    user.setUsername(cs.getString(2));
                    user.setEmail(cs.getString(3));
                    user.setPassword(cs.getString(4));
                    user.setRole(cs.getString(5));

                    return user;
                }
        );
    }

    public Map<String, Object> checkUserCredentials(String email, String password) {
        // SQL query to call the PL/SQL function
        String sql = "BEGIN ? := check_user_credentials(?, ?); END;";

        return jdbcTemplate.execute((Connection connection) -> {
            CallableStatement cs = connection.prepareCall(sql);

            // Set the input parameters
            cs.setString(2, email);
            cs.setString(3, password);

            // Register the output parameter (boolean)
            cs.registerOutParameter(1, Types.BOOLEAN);

            // Execute the callable statement
            cs.execute();

            // Check if credentials are valid
            boolean isValid = cs.getBoolean(1);

            if (isValid) {
                // If valid, return user_id and user_role as a map (or any format you prefer)
                String userIdSql = "SELECT user_id, user_role FROM users WHERE user_email = ?";
                return jdbcTemplate.queryForMap(userIdSql, email);  // returns a Map with user_id and user_role
            } else {
                return null; // If invalid credentials, return null or throw exception
            }
        });
    }

    //logic for forgot-password
    public boolean updatePassword(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);

        if (user.isPresent()) {
            User existingUser = user.get();
            existingUser.setPassword(password);
            userRepository.save(existingUser);  // Directly updates the password
            return true;
        } else {
            return false;  // User not found
        }
    }
}
