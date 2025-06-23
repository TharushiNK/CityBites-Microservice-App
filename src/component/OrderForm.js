import React, { useState, useEffect } from "react";
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


const OrderForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [order, setOrder] = useState({
    product_id: "",
    total: "",
    discounted_amount: "",
    final_amount: "",
    order_amount: "",
    user_id: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null); // To store the order details when fetched
  const [receiptVisible, setReceiptVisible] = useState(false);
  const [successMessage, setSuccessMessage] = useState(""); 

  // Get pre-calculated order data from navigation state
  useEffect(() => {
    if (location.state?.order) {
      const { order: calculatedOrder } = location.state;
      setOrder({
        ...calculatedOrder,
        // Make sure all values are strings for the TextField components
        product_id: String(calculatedOrder.product_id),
        total: String(calculatedOrder.total),
        discounted_amount: String(calculatedOrder.discounted_amount),
        final_amount: String(calculatedOrder.final_amount),
        order_amount: String(calculatedOrder.order_amount),
        user_id: String(calculatedOrder.user_id)
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setOrder({ ...order, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(""); 
  
    try {
      const orderData = {
        ...order,
        product_id: Number(order.product_id),
        total: Number(order.total),
        discounted_amount: Number(order.discounted_amount),
        final_amount: Number(order.final_amount),
        order_amount: Number(order.order_amount),
        user_id: Number(order.user_id),
      };
  
      // Send request to create the order
      const response = await axios.post("http://localhost:8080/orders", orderData);
      console.log("Full Response:", response.data);  // Debug log
  
      // Extract order ID from the response correctly
      const createdOrderId = response.data?.order_id;  // Use response.data.order_id directly
  
      if (!createdOrderId) {
        throw new Error("Order ID not found in response");
      }
  
      // Now fetch the order details using the order ID
      const orderDetailsResponse = await axios.get(`http://localhost:8080/orders/${createdOrderId}`);
      setOrderDetails(orderDetailsResponse.data);
      setReceiptVisible(true);
      setSuccessMessage("Order successfully placed! 🎉🎊"); 
  
    } catch (error) {
      console.error("Error:", error);
      setError(error.message || "Order creation failed. ❌ ⛔");
    } finally {
      setLoading(false);
    }
  };
  
  const handlePayNow = () => {
    // Handle the payment now logic (this could call another API for payment)
    console.log("Payment initiated for order ID:", orderDetails.id);
    if (orderDetails) {
      navigate("/paymentForm", { state: { order: orderDetails } });
    } else {
      console.error("Order details are missing");
    }
  };

  const handlePayLater = () => {
    // Handle the pay later logic (navigate to the payment screen or whatever you prefer)
    console.log("Payment will be made later for order ID:", orderDetails.id);
    navigate("/products", { state: { order: orderDetails } });
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ 
        mt: 5, 
        p: 3, 
        boxShadow: 3, 
        borderRadius: 2, 
        backgroundColor: "rgba(76, 175, 80, 0.1)" 
      }}>
        <Typography 
          variant="h5" 
          gutterBottom 
          textAlign="center" 
          sx={{ color: "#2E7D32" }}
        >
          Order Confirmation
        </Typography>
        
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Render the form only when receipt is not visible */}
        {!receiptVisible && (
          <Box sx={{ 
            backgroundColor: "white", 
            p: 2, 
            borderRadius: 2, 
            boxShadow: 2,
            mb: 3
          }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Product ID"
                name="product_id"
                value={order.product_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Quantity"
                name="order_amount"
                type="number"
                value={order.order_amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Total Amount"
                name="total"
                type="number"
                value={order.total}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Discount Applied"
                name="discounted_amount"
                type="number"
                value={order.discounted_amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="Final Amount to Pay"
                name="final_amount"
                type="number"
                value={order.final_amount}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <TextField
                label="User ID"
                name="user_id"
                type="number"
                value={order.user_id}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputProps={{
                  readOnly: true,
                }}
              />
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ 
                  mt: 2, 
                  backgroundColor: "#2E7D32",
                  '&:hover': {
                    backgroundColor: "#1B5E20",
                  },
                  height: '48px',
                }}
                disabled={loading}
              >
                {loading ? (
                  <CircularProgress size={24} sx={{ color: 'white' }} />
                ) : (
                  'Confirm Order'
                )}
              </Button>
            </form>
          </Box>
        )}

        
{error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>} {/* ✅ Success message */}


        {/* Show receipt once order is confirmed */}
        {receiptVisible && orderDetails && (
          <Box sx={{ 
            mt: 3, 
            p: 3, 
            backgroundColor: "white",
            border: '1px solid #2E7D32', 
            borderRadius: 2,
            textAlign: "center",
            lineHeight: 1.6
          }}>
            <Typography variant="h6" sx={{ color: "#2E7D32", mb: 2 }}>
              Receipt
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Product ID:</strong> {orderDetails.product_id}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Quantity:</strong> {orderDetails.order_amount}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Total Amount:</strong> {orderDetails.total}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Discount Applied:</strong> {orderDetails.discounted_amount}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>Final Amount:</strong> {orderDetails.final_amount}
            </Typography>
            <Typography sx={{ mb: 1 }}>
              <strong>User ID:</strong> {orderDetails.user_id}
            </Typography>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
              <Button 
                variant="contained" 
                sx={{ backgroundColor: "#2E7D32", '&:hover': { backgroundColor: "#1B5E20" } }} 
                onClick={handlePayNow}
              >
                Pay Now
              </Button>
              <Button 
                variant="outlined" 
                sx={{ color: "#2E7D32", borderColor: "#2E7D32", '&:hover': { borderColor: "#1B5E20" } }} 
                onClick={handlePayLater}
              >
                Pay Later
              </Button>
            </Box>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default OrderForm;
