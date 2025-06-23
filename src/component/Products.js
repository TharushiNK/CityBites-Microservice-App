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
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import foodImage from "./food-image.jpg";

const Products = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [orderAmount, setOrderAmount] = useState("");

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

  const handleOrderClick = (product) => {
    setSelectedProduct(product);
    setOpenDialog(true);
  };

  const handleOrderSubmit = async () => {
    if (!orderAmount || isNaN(orderAmount) || orderAmount <= 0) {
      alert("Please enter a valid order amount!");
      return;
    }

    const userId = localStorage.getItem("userId");
    if (!userId) {
      alert("User is not logged in.");
      return;
    }

    try {
      const orderData = {
        product_id: selectedProduct.product_id,
        order_amount: parseInt(orderAmount, 10),
        user_id: userId
      };

      const response = await axios.post(
        "http://localhost:8080/orders/calculation", 
        orderData
      );
      
      console.log("Calculated Order Data:", response.data);
      setOpenDialog(false);
      
      navigate("/orderForm", { 
        state: { 
          order: {
            ...response.data,
            product_id: selectedProduct.product_id,
            product_name: selectedProduct.description,
            per_price: selectedProduct.per_price,
            order_amount: parseInt(orderAmount, 10)
          }
        } 
      });
    } catch (error) {
      console.error("Error calculating order:", error);
      alert("Error processing order. Please try again!");
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
       Explore Your Taste!!
      </Typography>
      
      <Grid 
  container 
  spacing={3} 
  sx={{ 
    marginLeft: '50px', 
    marginRight: '50px', // Shifts grid 100px from the left
    justifyContent: 'center', 
  }}
>
  {products.map((product) => (
    <Grid item key={product.product_id} xs={12} sm={6} md={4} lg={3} xl={2}>
      <Card sx={{ 
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.3s, box-shadow 0.3s',
        '&:hover': {
          transform: 'translateY(-5px)',
          boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
        },
        boxShadow: 3
      }}>
              <CardMedia
                component="img"
                height="180"
                image={foodImage}
                alt={product.description}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h2">
                  {product.description}
                </Typography>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
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
              <CardActions>
                <Button
                  variant="contained"
                  sx={{ 
                    backgroundColor: product.remaining === 0 ? '#BDBDBD' : '#2E7D32',
                    color: product.remaining === 0 ? '#757575' : '#FFFFFF',
                    '&:hover': { backgroundColor: product.remaining === 0 ? '#BDBDBD' : '#1B5E20' }
                  }}
                  onClick={() => handleOrderClick(product)}
                  disabled={product.remaining === 0}
                >
                  Order Now
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ 
                    color: '#2E7D32',
                    borderColor: '#2E7D32',
                    '&:hover': { borderColor: '#1B5E20' }
                  }}
                  onClick={() => navigate(`/products/${product.product_id}/reviews`)}
                >
                  Reviews
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Order Amount Popup Dialog */}
      <Dialog open={openDialog} onClose={() => setOpenDialog(false)}>
        <DialogTitle>Enter Order Amount</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Order Amount"
            type="number"
            fullWidth
            value={orderAmount}
            onChange={(e) => setOrderAmount(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleOrderSubmit} color="primary">
            Submit
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Products;