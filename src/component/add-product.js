import React, { useState } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box,
  CircularProgress,
  Alert 
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AddProductForm = () => {
  const navigate = useNavigate();
  
  // Fetch supplier ID directly from localStorage like Appbar
  const userId = localStorage.getItem("userId");

  // Product state
  const [product, setProduct] = useState({
    description: "",
    per_price: "",
    quantity: "",
    remaining: "",
    SUP_ID:Number(userId)
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value, SUP_ID: Number(userId) });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    const newProduct = { 
        description: product.description,
        per_price: Number(product.per_price), // Ensure price is a number
        quantity: Number(product.quantity),   // Ensure quantity is a number
        remaining: Number(product.remaining), // Ensure remaining is a number
        sup_id: Number(userId) // Convert sup_id to number
    };

    console.log("Final Data Sent to Backend:", newProduct); // Debugging
    console.log("Type of sup_id:", typeof newProduct.sup_id); // Should be 'number'

    try {
        await axios.post("http://localhost:8080/products", newProduct);
        setSuccessMessage("Product added successfully!");
        setTimeout(() => navigate("/supplier-product"), 1500);
    } catch (error) {
        console.error("Error adding product:", error);
        setError("Failed to add product.");
    } finally {
        setLoading(false);
    }
};


  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
        <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#2E7D32" }}>
          Add New Product
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}
        <form onSubmit={handleSubmit}>
          <TextField
            label="Description"
            name="description"
            value={product.description}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Price"
            name="per_price"
            type="number"
            value={product.per_price}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Quantity"
            name="quantity"
            type="number"
            value={product.quantity}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Remaining"
            name="remaining"
            type="number"
            value={product.remaining}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
          />
          <TextField
            label="Supplier ID"
            name="SUP_ID"
            value={userId}
            fullWidth
            margin="normal"
            disabled
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#2E7D32", '&:hover': { backgroundColor: "#1B5E20" } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Add Product'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default AddProductForm;
