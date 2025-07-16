import { Navigate, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import { useState } from "react";
import { Toaster } from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { motion } from "framer-motion";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Home from "./components/Home";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import CartItems from "./components/cart/CartItems";
import PurchasedItems from "./components/cart/PurchasedItems";
import PurchaseSuccessPage from "./components/cart/PurchaseSuccess";
import PurchaseCancelPage from "./components/cart/PurchaseCancel";
import { AboutPage } from "./components/About";
import ContactPage from "./components/Contact";
import AdminPanel from "./components/admin/AdminPanel";
import EditProduct from "./components/admin/EditProduct";
import AddProduct from "./components/admin/AddProduct";
import NotFoundPage from "./components/NotFoundPage";

import useCartStore from "./stores/cartStore";
import { useAdminStore } from "./stores/adminStore";

function App() {
  const { userID } = useCartStore();
  const [cookies] = useCookies(["access_token"]);
  const { userRole } = useAdminStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1 }}
      className="min-h-screen flex flex-col font-sans"
    >
      <>
        <Header />

        <div className="flex justify-center items-center mx-auto flex-grow">
          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* Protected User Routes */}
            <Route
              path="/cart-items"
              element={
                cookies.access_token && userID ? (
                  <CartItems />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/purchased-items"
              element={
                cookies.access_token && userID ? (
                  <PurchasedItems />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/purchase-success"
              element={
                cookies.access_token && userID ? (
                  <PurchaseSuccessPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/purchase-cancel"
              element={
                cookies.access_token && userID ? (
                  <PurchaseCancelPage />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />

            {/* Admin Routes */}
            <Route
              path="/admin-dashboard"
              element={
                cookies.access_token && userID && userRole === "admin" ? (
                  <AdminPanel />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/edit-product/:id"
              element={
                cookies.access_token && userID && userRole === "admin" ? (
                  <EditProduct />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
            <Route
              path="/add-product"
              element={
                cookies.access_token && userID && userRole === "admin" ? (
                  <AddProduct />
                ) : (
                  <Navigate to="/login" />
                )
              }
            />
          </Routes>
        </div>
        <Footer />
      </>

      <Toaster />
    </motion.div>
  );
}

export default App;
