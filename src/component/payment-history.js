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

const PaymentTable = () => {
  const [payments, setPayments] = useState([]);
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

    const fetchPayments = async () => {
      try {
        const response = await axios.get(`http://localhost:8080/payments/users/${userId}`);
        setPayments(response.data);
      } catch (err) {
        setError("Failed to fetch payments.");
      } finally {
        setLoading(false);
      }
    };

    fetchPayments();
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
        Payment History
      </Typography>

      {loading && (
        <CircularProgress sx={{ display: "block", margin: "20px auto" }} />
      )}

      {error && (
        <Alert severity="error" sx={{ mb: 2 }}>
          {error}
        </Alert>
      )}

      {!loading && !error && payments.length === 0 && (
        <Typography textAlign="center">No payments found.</Typography>
      )}

      {!loading && !error && payments.length > 0 && (
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
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Pay ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Order ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>User ID</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Amount</TableCell>
                <TableCell sx={{ fontSize: "16px", fontWeight: "bold" }}>Paid Date</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {payments.map((payment) => (
                <TableRow key={payment.pay_id} sx={{ backgroundColor: "white", height: "60px" }}>
                  <TableCell>{payment.pay_id}</TableCell>
                  <TableCell>{payment.order_id}</TableCell>
                  <TableCell>{payment.user_id}</TableCell>
                  <TableCell>${payment.amount}</TableCell>
                  <TableCell>{new Date(payment.paid_date).toLocaleDateString()}</TableCell> {/* Format the date */}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Container>
  );
};

export default PaymentTable;
