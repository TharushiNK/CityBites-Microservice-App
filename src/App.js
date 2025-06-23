import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Appbar from "./component/Appbar";
import Login from "./component/Login";
import Signup from "./component/Signup";
import Products from "./component/Products"; 
import Payment from "./component/Payments";
import OrderDetails from "./component/OrderDetails";
import OrderForm from "./component/OrderForm";
import PaymentForm from "./component/Payments";
import DeliveryForm from "./component/deliveryForm";
import ForgotPassword from "./component/ForgotPassword";
import OrderTable from "./component/order-history";
import PaymentTable from "./component/payment-history";
import DeliveryTable from "./component/delivery-history";
import SupplierProducts from "./component/SupplierProduct";
import UpdateProductForm from "./component/update-product";
import AddProductForm from "./component/add-product";


export default function App() {
  return (
    <Router>
      <Appbar />
      <Routes>
        <Route path="/products" element={<Products />} />
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/products" element={<Products />} />
        <Route path="/payment" element={<Payment/>} />
        <Route path="/orderDetails" element={<OrderDetails />} />
        <Route path="/orderForm" element={<OrderForm />} />
        <Route path="/paymentForm" element={<PaymentForm />} />
        <Route path="/deliveryForm" element={<DeliveryForm />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/order-history" element={<OrderTable />} />
        <Route path="/payment-history" element={<PaymentTable />} />
        <Route path="/delivery-history" element={<DeliveryTable />} />
        <Route path="/supplier-product" element={<SupplierProducts />} />
        <Route path="/update-product" element={<UpdateProductForm />} />
        <Route path="/add-product" element={<AddProductForm />} />
        
      </Routes>

    </Router>
  );
}
