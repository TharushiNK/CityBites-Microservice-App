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

const PaymentForm = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [payment, setPayment] = useState({
    order_id: "",
    user_id: "",
    amount: "",
    paid_date: "",
    pay_id: "", 
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [paymentSuccessful, setPaymentSuccessful] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");

  useEffect(() => {
    if (location.state?.order) {
      const { order } = location.state;
      setPayment({
        order_id: String(order.order_id),
        user_id: String(order.user_id),
        amount: String(order.final_amount), 
        paid_date: "",
        pay_id: "", 
      });
    }
  }, [location.state]);

  const handleChange = (e) => {
    setPayment({ ...payment, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMessage("");

    try {
      const paymentData = {
        order_id: Number(payment.order_id),
        user_id: Number(payment.user_id),
        amount: Number(payment.amount),
        paid_date: payment.paid_date,
      };

      const response = await axios.post("http://localhost:8080/payments", paymentData);
      const pay_id = response.data?.pay_id;

      if (pay_id) {
        setPaymentSuccessful(true);
        setPayment({ ...payment, pay_id });
        setSuccessMessage("Payment successfully completed! 🎉🎊");
      } else {
        throw new Error("Payment failed");
      }
    } catch (error) {
      console.error("Error processing payment:", error);
      setError(error.message || "Payment failed ❌ · ⛔");
    } finally {
      setLoading(false);
    }
  };

  const handlePickupOrDelivery = (option) => {
    navigate("/deliveryForm", {
      state: {
        paymentDetails: {
          order_id: payment.order_id,
          user_id: payment.user_id,
          pay_id: payment.pay_id,
          amount: payment.amount, 
        },
      },
    });
  };

  return (
    <Container maxWidth="md">
      <Box 
        sx={{ 
          display: "flex", 
          justifyContent: "space-between", 
          alignItems: "center", 
          mt: 5 
        }}
      >

        {/* Payment Form & Receipt Section */}
        <Box 
          sx={{ 
            flex: 2, 
            p: 3, 
            boxShadow: 3, 
            borderRadius: 2, 
            backgroundColor: "rgba(76, 175, 80, 0.1)", 
            minWidth: "350px" 
          }}
        >
          <Typography 
            variant="h5" 
            gutterBottom 
            textAlign="center" 
            sx={{ color: "#2E7D32" }}
          >
            Payment Form
          </Typography>

          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

          {!paymentSuccessful ? (
            <Box sx={{ 
              backgroundColor: "white", 
              p: 3, 
              borderRadius: 2, 
              boxShadow: 2 
            }}>
              <form onSubmit={handleSubmit}>
                <TextField 
                  label="Order ID" 
                  name="order_id" 
                  value={payment.order_id} 
                  fullWidth 
                  margin="normal" 
                  InputProps={{ readOnly: true }} 
                />
                <TextField 
                  label="User ID" 
                  name="user_id" 
                  value={payment.user_id} 
                  fullWidth 
                  margin="normal" 
                  InputProps={{ readOnly: true }} 
                />
                <TextField 
                  label="Amount" 
                  name="amount" 
                  value={payment.amount} 
                  fullWidth 
                  margin="normal" 
                  InputProps={{ readOnly: true }} 
                />
                <TextField 
                  label="Paid Date" 
                  name="paid_date" 
                  type="date" 
                  value={payment.paid_date} 
                  onChange={handleChange} 
                  fullWidth 
                  margin="normal" 
                  InputLabelProps={{ shrink: true }} 
                />
                <Button 
                  type="submit" 
                  variant="contained" 
                  fullWidth 
                  sx={{ 
                    mt: 2, 
                    backgroundColor: "#2E7D32", 
                    '&:hover': { backgroundColor: "#1B5E20" } 
                  }} 
                  disabled={loading}
                >
                  {loading ? <CircularProgress size={24} sx={{ color: 'white' }} /> : 'Submit Payment'}
                </Button>
              </form>
            </Box>
          ) : (
            <Box sx={{ 
              p: 3, 
              borderRadius: 2, 
              backgroundColor: "white", 
              boxShadow: 2, 
              textAlign: "center" 
            }}>
              {successMessage && <Alert severity="success" sx={{ mb: 2 }}>{successMessage}</Alert>}

              <Typography variant="h6" sx={{ color: "#2E7D32", marginBottom: 2 }}>
                Payment Successful
              </Typography>
              <Typography><strong>Order ID:</strong> {payment.order_id}</Typography>
              <Typography><strong>User ID:</strong> {payment.user_id}</Typography>
              <Typography><strong>Amount Paid:</strong> {payment.amount}</Typography>
              <Typography><strong>Paid Date:</strong> {payment.paid_date}</Typography>
              <Typography><strong>Payment Id:</strong> {payment.pay_id}</Typography>

              <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 3 }}>
                <Button 
                  variant="contained" 
                  sx={{ backgroundColor: "#2E7D32", '&:hover': { backgroundColor: "#1B5E20" } }} 
                  onClick={() => handlePickupOrDelivery('pickup')}
                >
                  Pickup
                </Button>
                <Button 
                  variant="outlined" 
                  sx={{ color: "#2E7D32", borderColor: "#2E7D32", '&:hover': { borderColor: "#1B5E20" } }} 
                  onClick={() => handlePickupOrDelivery('delivery')}
                >
                  Delivery
                </Button>
              </Box>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  );
};

export default PaymentForm;
