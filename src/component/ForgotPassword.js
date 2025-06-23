import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box } from "@mui/material";
import axios from "axios";
import './User.css'; // Import the CSS for styling

export default function ForgotPassword() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", newPassword: "" });
  const [message, setMessage] = useState(""); // To store success or error messages

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:8080/forgot-password", {
        email: form.email,
        password: form.newPassword, // Ensure this matches the controller's @RequestParam
      });
  
      if (response.status === 200) {
        setMessage("Password updated successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 2000);
      }
    } catch (error) {
      console.error("Forgot Password error:", error);
      setMessage("Error resetting password. Ensure email exists.");
    }
  };

  return (
    <Container className="container">
      <Container className="login-container">
        <Box className="login-box">
          <Box className="login-form">
            <Typography variant="h4" className="login-title">Forgot Password</Typography>
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
                label="New Password"
                name="newPassword"
                type="password"
                value={form.newPassword}
                onChange={handleChange}
                fullWidth
                margin="normal"
                required
              />
              <Button type="submit" variant="contained" className="login-btn" fullWidth>
                Reset Password
              </Button>
            </form>

            {message && (
              <Typography className="error-message">{message}</Typography>
            )}

            <Typography className="signup-forgot">
              <span onClick={() => navigate('/login')} className="clickable">Back to Login</span>
            </Typography>
          </Box>
        </Box>
      </Container>
    </Container>
  );
}
