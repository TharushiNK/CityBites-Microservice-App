# 🍽️ City Bites – Urban Food Development Web Application

City Bites is a full-stack urban food delivery web application built using a microservices architecture. The system supports a complete online food ordering flow — from user signup to order placement, payment, and delivery — while offering administration panels for managing both customers and suppliers. It’s designed to be scalable, secure, and responsive for urban food ecosystems.

---

## 📌 Project Description

City Bites offers a modern platform where users can explore food menus, place orders, and receive deliveries from city-based food vendors. The application is designed with a **microservice architecture**, built on **Spring Boot** for the backend, **React.js** for the frontend, and uses both **Oracle Database** (for core transactional data) and **MongoDB** (for storing user reviews and feedback).

The system includes separate modules for **customer**, **supplier**, and **admin** operations, ensuring clear separation of responsibilities and role-based access.

---

**🎬 Demo Video:** [▶️ citybites.mp4](./citybites.mp4)

> This video demonstrates the complete order lifecycle — user registration, food selection, cart management, payment, and delivery coordination.

---

## 🚀 Core Features

- 🔐 **User Registration & Login**  
  Secure authentication with JWT and role-based access (Customer, Supplier, Admin)

- 🛍️ **Menu Browsing & Product Selection**  
  Users can view food items by vendor, cuisine, or popularity

- 🧺 **Cart & Order Placement**  
  Add to cart, review items, and place orders with validation

- 💳 **Payment Integration**  
  Simulated payment system with status updates

- 🚚 **Delivery Setup & Tracking**  
  Set delivery address and track order processing stages

- 📝 **User Reviews & Feedback**  
  MongoDB is used to store product and vendor reviews

- 🧑‍💼 **Admin & Supplier Panel**  
  Admin can manage users, suppliers, and orders  
  Suppliers can manage menus, availability, and order fulfillment

---

## 🛠️ Tech Stack

| Layer        | Technology                       |
|--------------|----------------------------------|
| Frontend     | React.js	                  |
| Backend      | Spring Boot (Java), REST APIs    |
| Database     | Oracle SQL (Transactional Data)  |
| NoSQL        | MongoDB (Reviews & Feedback)     |
| Architecture | Microservices via Spring Cloud   |

---

## 🧱 Microservices Overview

- **🔐 User Service**  
  Handles authentication, profile management, and user roles (Admin, Customer, Supplier)

- **🛒 Product Service**  
  Manages product/menu data for suppliers

- **📦 Order Service**  
  Handles cart actions, order creation, and payment updates

- **🚚 Delivery Service**  
  Tracks delivery addresses, order status, and dispatching

- **📝 Review Service**  
  Stores user reviews and feedback in MongoDB

- **🌐 Gateway Service**  
  API Gateway for routing and centralized access

- **🛠️ Admin Service**  
  Dashboard to monitor and manage users, suppliers, and orders

---
