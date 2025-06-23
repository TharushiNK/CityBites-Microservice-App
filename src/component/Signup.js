import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { TextField, Button, Container, Typography, Box, Select, MenuItem, InputLabel, FormControl } from "@mui/material";
import axios from "axios";

export default function Signup() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", email: "", password: "", role: "customer"});
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRoleChange = (e) => {
    setForm({ ...form, role: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let response;

      if (form.role === "supplier") {
        // Send request to /suppliers endpoint for supplier creation
        response = await axios.post("http://localhost:8080/suppliers", {
          sup_name: form.username,
          sup_email: form.email,
          sup_password: form.password,
        });
        console.log("Supplier created:", response.data);
      } else {
        // Send request to /users endpoint for user creation (customer, admin)
        response = await axios.post("http://localhost:8080/users", {
          username: form.username,
          email: form.email,
          password: form.password,
          role: form.role,
        });
        console.log("User created:", response.data);
      }

      const { user_id } = response.data; // Assuming the response contains the user_id or sup_id
      localStorage.setItem("user_id", user_id);

      navigate("/"); // Redirect to homepage or product page after signup
    } catch (err) {
      console.error("Signup error:", err.response ? err.response.data : err.message);
      setError("Error signing up. Please try again.");
    }
  };

  return (
    <Container maxWidth="sm">
      <Box mt={5} p={3} boxShadow={3} borderRadius={2} textAlign="center" sx={{ backgroundColor: "white" }}>
        <Typography variant="h5" gutterBottom>
          Sign Up
        </Typography>
        {error && <Typography color="error">{error}</Typography>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="username"
            value={form.username}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Email"
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <TextField
            label="Password"
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
          />
          <FormControl fullWidth margin="normal">
            <InputLabel>Role</InputLabel>
            <Select
              label="Role"
              name="role"
              value={form.role}
              onChange={handleRoleChange}
            >
              <MenuItem value="customer">Customer</MenuItem>
              <MenuItem value="supplier">Supplier</MenuItem>
            </Select>
          </FormControl>

          <Button type="submit" variant="contained" color="primary" fullWidth>
            Sign Up
          </Button>
        </form>
        <Typography variant="body2" mt={2}>
          Already have an account?{" "}
          <Button color="secondary" onClick={() => navigate("/")}>
            Login
          </Button>
        </Typography>
      </Box>
    </Container>
  );
}
