import React, { useState, useEffect } from "react";
import { 
  Card, 
  CardContent, 
  CardActions,
  CardMedia, 
  Typography, 
  Button, 
  Grid, 
  Box,
  Container,
  Chip,
  CircularProgress
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import foodImage from "./food-image.jpg";

const SupplierProducts = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userId, setUserId] = useState(null); // Ensure userId is properly initialized

  // Fetch products from backend
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/products");
        setProducts(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching products:", error);
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  // Get supplier ID from local storage
  useEffect(() => {
    const storedUserId = localStorage.getItem("userId");
    if (storedUserId) {
      setUserId(Number(storedUserId)); // Convert to number
    }
  }, []);

  // Handle update product
  const handleUpdateProduct = (product) => {
    navigate(`/update-product`, { state: { product } });
  };

  // Handle delete product
  const handleDeleteProduct = async (productId) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    try {
      await axios.delete(`http://localhost:8080/products/${productId}`);
      setProducts(products.filter(product => product.product_id !== productId));
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("Error deleting product. Please try again!");
    }
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress sx={{ color: '#2E7D32' }} />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography 
        variant="h4" 
        component="h1" 
        gutterBottom 
        sx={{ 
          color: '#2E7D32',
          fontWeight: 'bold',
          mb: 4,
          textAlign: 'center'
        }}
      >
        Manage Your Products
      </Typography>
      
      <Grid 
        container 
        spacing={3}
        sx={{
          padding: '0 24px',
          justifyContent: 'center'
        }}
      >
        {products.map((product) => (
          <Grid 
            item 
            key={product.product_id} 
            xs={12}  
            sm={6}   
            md={4}   
            lg={2.4} 
            xl={2.4} 
            sx={{
              display: 'flex',
              justifyContent: 'center',
              maxWidth: 'calc(20% - 24px)', 
              flexBasis: 'calc(20% - 24px)',
              flexGrow: 0
            }}
          >
            <Card 
              sx={{ 
                width: '100%',
                maxWidth: 300,
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                transition: 'transform 0.3s, box-shadow 0.3s',
                '&:hover': {
                  transform: 'translateY(-5px)',
                  boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
                },
                boxShadow: 3
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={foodImage}
                alt={product.description}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2" noWrap>
                  {product.description}
                </Typography>
                <Box sx={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  mb: 1 
                }}>
                  <Typography variant="body1" color="text.secondary">
                    Rs. {product.per_price}
                  </Typography>
                  <Chip 
                    label={`${product.remaining} left`} 
                    size="small" 
                    color={product.remaining < 10 ? "error" : "success"}
                  />
                </Box>
              </CardContent>
              <CardActions sx={{ gap: "25" }}>
                <Button
                  variant="contained"
                  fullWidth
                  sx={{ mt: 2, backgroundColor: " rgba(2, 133, 54, 0.89)", '&:hover': { backgroundColor: "#1B5E20" } }}
                  disabled={loading || product.sup_id !== userId}  
                  onClick={() => handleUpdateProduct(product)}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Update'}
                </Button>

              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default SupplierProducts;
