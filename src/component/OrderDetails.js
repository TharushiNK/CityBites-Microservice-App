import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, Typography, Button, Box } from "@mui/material";

const OrderDetails = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const order = location.state?.order; // Expecting order details to be passed in state

  const handleProceedPayment = () => {
    // Navigate to the payment page, passing the order details if needed
    navigate("/payment", { state: { order } });
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", marginTop: 4 }}>
      <Card sx={{ width: 400, padding: 2, backgroundColor: "rgba(76, 175, 80, 0.1)" }}>
        <CardContent>
          <Typography variant="h5" sx={{ textAlign: "center", color: "#2E7D32", marginBottom: 2 }}>
            Order Details
          </Typography>
          {order ? (
            <>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Order ID:</strong> {order.order_id}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Product ID:</strong> {order.product_id}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Total:</strong> Rs. {order.total}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Discounted Amount:</strong> Rs. {order.discounted_amount}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Final Amount:</strong> Rs. {order.final_amount}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 1 }}>
                <strong>Order Amount:</strong> Rs. {order.order_amount}
              </Typography>
              <Typography variant="body1" sx={{ marginBottom: 2 }}>
                <strong>User ID:</strong> {order.user_id}
              </Typography>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                sx={{ backgroundColor: "#66BB6A" }}
                onClick={handleProceedPayment}
              >
                Proceed to Payment
              </Button>
            </>
          ) : (
            <Typography variant="body1" sx={{ textAlign: "center" }}>
              No order details available.
            </Typography>
          )}
        </CardContent>
      </Card>
    </Box>
  );
};

export default OrderDetails;
