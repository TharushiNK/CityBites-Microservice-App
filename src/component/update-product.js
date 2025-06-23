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
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const UpdateProductForm = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const productData = location.state?.product; // Retrieve product from state
  const userId = Number(localStorage.getItem("userId"));

  // Initialize form state with product data
  const [product, setProduct] = useState({
    description: productData?.description || "",
    per_price: productData?.per_price || "",
    quantity: productData?.quantity || "",
    sup_id: productData?.sup_id ? Number(productData.sup_id) : "",
    remaining: productData?.remaining || "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState("");

  const handleChange = (e) => {
    setProduct({ ...product, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      await axios.put(`http://localhost:8080/products/${productData.product_id}`, product);
      setSuccessMessage("Product updated successfully!");
      setTimeout(() => navigate("/supplier-product"), 1500);
    } catch (error) {
      console.error("Error updating product:", error);
      setError("Product update failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "white" }}>
        <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#2E7D32" }}>
          Update Product
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
            label="Supplier ID"
            name="sup_id"
            type="number"
            value={product.sup_id}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            disabled
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
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{ mt: 2, backgroundColor: "#2E7D32", '&:hover': { backgroundColor: "#1B5E20" } }}
            disabled={loading}
          >
            {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update Product'}
          </Button>
        </form>
      </Box>
    </Container>
  );
};

export default UpdateProductForm;
