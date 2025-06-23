import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import './User.css'; // Import the CSS for styling
import loginImage from './login-image.png'; // Import login image

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", role: "" }); // Added role field
  const [error, setError] = useState(""); // To store any error message

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    let endpoint = ""; // Will store the correct endpoint
    let loginData = {}; // Will store the login data based on the role

    // Check if role is 'user' (customer)
    if (form.role === "user") {
      endpoint = "http://localhost:8080/login"; // Customer login endpoint
      loginData = {
        email: form.email,
        password: form.password,
      };

      try {
        const response = await axios.post(endpoint, loginData);

        if (response.data) {
          // Assuming the response contains user_id, role, and username
          localStorage.setItem("userId", response.data.USER_ID); // Corrected the key name for customer
          localStorage.setItem("userRole", response.data.USER_ROLE);
          localStorage.setItem("username", response.data.username);

          // Redirect based on user role
          let navigatePath = '/products'; // Default path for customer
          const userData = {
            userId: response.data.USER_ID,
            userRole: response.data.USER_ROLE,
          };

          if (response.data.USER_ROLE.toLowerCase() === 'supplier') {
            navigatePath = '/supplier-product';
          } else if (response.data.USER_ROLE.toLowerCase() === 'customer') {
            navigatePath = '/products';
          } else if (response.data.USER_ROLE.toLowerCase() === 'admin') {
            navigatePath = '/admin-dashboard';
          }

          setTimeout(() => {
            navigate(navigatePath, { state: userData });
          }, 1000);
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login. Please try again.");
      }
    } else  {
      // Else block for 'supplier' role
      endpoint = "http://localhost:8080/suppliers/login"; // Supplier login endpoint
      loginData = {
        sup_email: form.email,
        sup_password: form.password,
      };

      try {
        const response = await axios.post(endpoint, loginData);

        if (response.data) {
          // Assuming the response contains SUP_ID, SUP_NAME, and SUP_EMAIL for supplier
          localStorage.setItem("userId", response.data.SUP_ID); // Use 'SUP_ID' for supplier
          localStorage.setItem("userRole", "supplier");
          localStorage.setItem("username", response.data.SUP_NAME);

          // Redirect to supplier booking page
          navigate('/supplier-product', { state: { userId: response.data.SUP_ID, userRole: "supplier" } });
        }
      } catch (error) {
        console.error("Login error:", error);
        setError("An error occurred during login. Please try again.");
      }
    } 
  };

  return (
    <Container className="container">
      <Container className="login-container">
        <Box className="login-box">
          {/* Left Section: Image */}
          <Box className="login-image">
            <img src={loginImage} alt="Login" />
          </Box>
          {/* Right Section: Login Form */}
          <Box className="login-form">
            <Typography variant="h4" className="login-title">Login</Typography>

            <form onSubmit={handleSubmit}>
              <TextField
                label="Email"
                name="email"
                type="email"
                value={form.email}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <TextField
                label="Password"
                name="password"
                type="password"
                value={form.password}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              
              {/* Add a dropdown to select the role (user or supplier) */}
              <TextField
                label="Role"
                name="role"
                select
                value={form.role}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
                SelectProps={{
                  native: true,
                }}
              >
                <option value=""></option>
                <option value="user">User</option>
                <option value="supplier">Supplier</option>
              </TextField>

              <Button type="submit" variant="contained" className="login-btn" fullWidth>
                Login
              </Button>
            </form>

            {error && (
              <Typography className="error-message">{error}</Typography>
            )}

            <Typography className="signup-forgot">
              <span onClick={() => navigate('/signup')} className="clickable">Sign Up</span> | 
              <span onClick={() => navigate('/forgot-password')} className="clickable">Forgot Password?</span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
