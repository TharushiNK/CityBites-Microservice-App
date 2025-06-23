import React, { useState, useEffect } from "react";
import { 
  Container, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  CircularProgress, 
  Alert, 
  Typography 
} from "@mui/material";
import axios from "axios";

const OrderTable = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Get user ID from localStorage and parse it
  const storedUserId = localStorage.getItem("userId");
  const userId = storedUserId ? parseInt(storedUserId, 10) : null;

  useEffect(() => {
    if (!userId) {
      setError("User ID not found. Please log in again.");
      setLoading(false);
      return;
    }

    const fetchOrders = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/orders/users/${userId}`);
        setOrders(response.data);
      } catch (err) {
        setError("Failed to fetch orders.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, [userId]);

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}> 
      {/* Increased maxWidth to "xl" for full width */}
      <Typography 
        variant="h5" 
        gutterBottom 
        textAlign="center" 
        sx={{ color: "#2E7D32", mb: 3 }}
      >
        Order History
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && orders.length === 0 && (
        <Typography textAlign="center">No orders found.</Typography>
      )}

      {!loading && !error && orders.length > 0 && (
        <TableContainer 
          component={Paper} 
          sx={{ 
            boxShadow: 3, 
            borderRadius: 2, 
            width: "100%", 
            overflowX: "auto", 
            minHeight: "400px"  // Ensure it has a decent height
          }}
        >
          <Table sx={{ minWidth: 900 }}> {/* Adjust minWidth for proper layout */}
            <TableHead>
              <TableRow sx={{ backgroundColor: "#f5f5f5" }}>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Product ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Total</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Discount</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Final Amount</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Quantity</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {orders.map((order) => (
                <TableRow key={order.order_id} sx={{ backgroundColor: "white", height: "60px" }}>
                  <TableCell>{order.order_id}</TableCell>
                  <TableCell>{order.product_id}</TableCell>
                  <TableCell>${order.total}</TableCell>
                  <TableCell>${order.discounted_amount}</TableCell>
                  <TableCell>${order.final_amount}</TableCell>
                  <TableCell>{order.order_amount}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default OrderTable;
