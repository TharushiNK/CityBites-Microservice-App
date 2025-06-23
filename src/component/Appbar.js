import React from "react";
import { useNavigate } from "react-router-dom";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";

import PaymentsIcon from "@mui/icons-material/Payments";

import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import ReceiptIcon from "@mui/icons-material/Receipt";
import { styled } from "@mui/material/styles";

// Custom Styled Components
const StyledAppBar = styled(AppBar)({
  backgroundColor: "#282c34", // Dark background matching your navbar
  borderRadius: "20px",
  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  margin: "16px auto",
  maxWidth: "calc(100% - 32px)",
  padding: "0 16px",
});

const NavButton = styled(Button)({
  color: "#ffffff",
  backgroundColor: "#444",
  margin: "0 8px",
  padding: "8px 16px",
  borderRadius: "5px",
  transition: "all 0.3s ease",
  "&:hover": {
    backgroundColor: "rgb(11, 17, 63)",
    transform: "scale(1.05)",
  },
});

export default function Appbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("userId");
    localStorage.removeItem("userRole");
    navigate("/"); // Redirect to login page
  };

  const userRole = localStorage.getItem("userRole");
  const userId = localStorage.getItem("userId");

  // Define navigation buttons based on user roles
  const pages = [

  

    ...(userRole === "supplier" ? [{ name: "Add foods", path: "/add-product", icon: <ShoppingCartIcon /> }] : []), 
   
    ...(userRole === "customer" ? [{ name: "Products", path: "/products", icon: <ShoppingCartIcon /> }] : []),
    ...(userRole === "customer" ? [{ name: "Order", path: "/order-history", icon: <ReceiptIcon /> }] : []),
    ...(userRole === "customer" ? [{ name: "Payment", path: "/payment-history", icon: <PaymentsIcon /> }] : []),
    ...(userRole === "customer" ? [{ name: "Delivery", path: "/delivery-history", icon: <LocalShippingIcon /> }] : []),
  ];

  return (
    <Box sx={{ flexGrow: 1 }}>
      <StyledAppBar position="static">
        <Toolbar>
          {/* Menu Icon (optional, can be used for mobile version) */}
          <IconButton size="small" edge="start" color="inherit" aria-label="menu" sx={{ mr: 2 }}>
            <MenuIcon />
          </IconButton>

          {/* Logo / App Name */}
          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              cursor: "pointer",
              fontWeight: "bold",
              color: "#ffffff",
              textAlign: "center",
              "&:hover": { opacity: 0.9 },
            }}
            onClick={() => navigate("/")}
          >
            City Bites
          </Typography>

          {/* Navigation Buttons */}
          {pages.map((page) => (
            <NavButton key={page.name} onClick={() => navigate(page.path)}sx={{ color: "white", marginLeft: 2 }}>
              {page.icon} {page.name}
            </NavButton>
          ))}

          {/* User Info (User Role & ID) */}
          <Typography variant="body1" sx={{ color: "white", marginRight: 2 }}>
            {userRole} (ID: {userId})
          </Typography>

          {/* Profile & Logout Icons */}
          <IconButton color="inherit" onClick={() => navigate("/UserProfile")}>
            <AccountCircleIcon />
          </IconButton>
          <IconButton color="inherit" onClick={handleLogout}>
            <LogoutIcon />
          </IconButton>
        </Toolbar>
      </StyledAppBar>
    </Box>
  );
}
