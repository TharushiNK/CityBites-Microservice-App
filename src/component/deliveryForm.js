import React, { useState, useEffect } from "react";
import { 
  Container, 
  TextField, 
  Button, 
  Typography, 
  Box, 
  CircularProgress, 
  Alert, 
  IconButton 
} from "@mui/material";
import { Home as HomeIcon, CheckCircleOutline } from "@mui/icons-material";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const DeliveryForm = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [deliveryDetails, setDeliveryDetails] = useState({
    order_id: "",
    user_id: "",
    pay_id: "",
    amount: "",  
    delivery_address: "",
    delivery_date: "",
    delivery_status: "pending",
  });

  const [deliveryReceipt, setDeliveryReceipt] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  useEffect(() => {
    if (location.state?.paymentDetails) {
      const { order_id, user_id, pay_id, amount } = location.state.paymentDetails;
      setDeliveryDetails(prev => ({
        ...prev,
        order_id,
        user_id,
        pay_id,
        amount,  
      }));
    }
  }, [location.state]);

  const handleChange = (e) => {
    setDeliveryDetails({ ...deliveryDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage(null);

    try {
      const deliveryData = {
        order_id: Number(deliveryDetails.order_id),
        user_id: Number(deliveryDetails.user_id),
        pay_id: Number(deliveryDetails.pay_id),
        delivery_address: deliveryDetails.delivery_address,
        delivery_date: deliveryDetails.delivery_date,
        delivery_status: "pending",
        amount: Number(deliveryDetails.amount),
      };

      const response = await axios.post("http://localhost:8080/deliveries", deliveryData);
      const deliveryId = response.data.delivery_id;

      const receiptResponse = await axios.get(`http://localhost:8080/deliveries/${deliveryId}`);
      setDeliveryReceipt(receiptResponse.data);
      setSuccessMessage("Delivery successfully confirmed!🎉🎊");

    } catch (error) {
      setError(error.response?.data?.message || "Delivery confirmation failed.❌ · ⛔");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 5, p: 3, boxShadow: 3, borderRadius: 2, backgroundColor: "rgba(76, 175, 80, 0.1)" }}>
        <Typography variant="h5" gutterBottom textAlign="center" sx={{ color: "#2E7D32" }}>
          Delivery Form
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {successMessage && (
          <Alert severity="success" sx={{ mb: 2 }}>
            <CheckCircleOutline sx={{ verticalAlign: "middle", mr: 1 }} />
            {successMessage}
          </Alert>
        )}

        {deliveryReceipt ? (
          <Box sx={{ mt: 4, p: 3, borderRadius: 2, backgroundColor: "white", boxShadow: 3 }}>
            <Typography variant="h6" sx={{ color: "#2E7D32", mb: 2 }}>Delivery Receipt</Typography>
            <Typography><strong>Delivery ID:</strong> {deliveryReceipt.delivery_id}</Typography>
            <Typography><strong>Order ID:</strong> {deliveryReceipt.order_id}</Typography>
            <Typography><strong>User ID:</strong> {deliveryReceipt.user_id}</Typography>
            <Typography><strong>Payment ID:</strong> {deliveryDetails.pay_id}</Typography>
            <Typography><strong>Amount:</strong> {deliveryDetails.amount}</Typography>
            <Typography><strong>Delivery Date:</strong> {deliveryReceipt.delivery_date}</Typography>
            <Typography><strong>Delivery Status:</strong> {deliveryReceipt.delivery_status}</Typography>
            <Typography><strong>Delivery Address:</strong> {deliveryReceipt.delivery_address}</Typography>
            <IconButton 
                onClick={() => navigate("/products")} 
                sx={{ mt: 2, display: "block", mx: "auto" }}
              >
                <HomeIcon fontSize="large" sx={{ color: "#2E7D32" }} />
              </IconButton>
          </Box>
        ) : (
          <Box sx={{ backgroundColor: "white", p: 3, borderRadius: 2, boxShadow: 2 }}>
            <form onSubmit={handleSubmit}>
              <TextField
                label="Order ID"
                name="order_id"
                value={deliveryDetails.order_id}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="User ID"
                name="user_id"
                value={deliveryDetails.user_id}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Payment ID"
                name="pay_id"
                value={deliveryDetails.pay_id}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Amount"
                name="amount"
                value={deliveryDetails.amount}
                fullWidth
                margin="normal"
                InputProps={{ readOnly: true }}
              />
              <TextField
                label="Address"
                name="delivery_address"
                value={deliveryDetails.delivery_address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Delivery Date"
                name="delivery_date"
                type="date"
                value={deliveryDetails.delivery_date}
                onChange={handleChange}
                fullWidth
                margin="normal"
                InputLabelProps={{ shrink: true }}
              />
              
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 2, backgroundColor: "#2E7D32", '&:hover': { backgroundColor: "#1B5E20" } }}
                disabled={loading}
              >
                {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Confirm Delivery'}
              </Button>

              {/* Home Icon Button Inside Form */}
              <IconButton 
                onClick={() => navigate("/products")} 
                sx={{ mt: 2, display: "block", mx: "auto" }}
              >
                <HomeIcon fontSize="large" sx={{ color: "#2E7D32" }} />
              </IconButton>
            </form>
          </Box>
        )}
      </Box>
    </Container>
  );
};

export default DeliveryForm;
