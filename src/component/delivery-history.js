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

const DeliveryTable = () => {
  const [deliveries, setDeliveries] = useState([]);
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

    const fetchDeliveries = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/deliveries/users/${userId}`);
        setDeliveries(response.data);
      } catch (err) {
        setError("Failed to fetch deliveries.");
      } finally {
        setLoading(false);
      }
    };

    fetchDeliveries();
  }, [userId]);

  return (
    <Container maxWidth="xl" sx={{ mt: 5 }}>
      <Typography 
        variant="h5" 
        gutterBottom 
        textAlign="center" 
        sx={{ color: "#2E7D32", mb: 3 }}
      >
        Delivery History
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && deliveries.length === 0 && (
        <Typography textAlign="center">No deliveries found.</Typography>
      )}

      {!loading && !error && deliveries.length > 0 && (
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
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Delivery ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Delivery Status</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Delivery Address</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Pay ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Delivery Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {deliveries.map((delivery) => (
                <TableRow key={delivery.delivery_id} sx={{ backgroundColor: "white", height: "60px" }}>
                  <TableCell>{delivery.delivery_id}</TableCell>
                  <TableCell>{delivery.order_id}</TableCell>
                  <TableCell>{delivery.user_id}</TableCell>
                  <TableCell>{delivery.delivery_status}</TableCell>
                  <TableCell>{delivery.delivery_address}</TableCell>
                  <TableCell>{delivery.pay_id}</TableCell>
                  <TableCell>{new Date(delivery.delivery_date).toLocaleDateString()}</TableCell> {/* Format the date */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default DeliveryTable;
