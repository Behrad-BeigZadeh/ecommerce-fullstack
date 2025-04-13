import { Navigate, Route, Routes } from "react-router-dom";
import Home from "./components/Home";
import Header from "./components/Header";
import Footer from "./components/Footer";
import Signup from "./components/auth/Signup";
import Login from "./components/auth/Login";
import ForgotPassword from "./components/auth/ForgotPassword";
import ResetPassword from "./components/auth/ResetPassword";
import { Toaster } from "react-hot-toast";
import CartItems from "./components/cart/CartItems";
import { useCookies } from "react-cookie";
import PurchasedItems from "./components/cart/PurchasedItems";
import PurchaseSuccessPage from "./components/cart/PurchaseSuccess";
import PurchaseCancelPage from "./components/cart/PurchaseCancel";

import useCartStore from "./stores/cartStore";
import { useEffect, useState } from "react";
import { AboutPage } from "./components/About";
import ContactPage from "./components/Contact";
import { ClipLoader } from "react-spinners";
import AdminPanel from "./components/admin/AdminPanel";
import { useAdminStore } from "./stores/adminStore";
import EditProduct from "./components/admin/EditProduct";
import NotFoundPage from "./components/NotFoundPage";
import AddProduct from "./components/admin/AddProduct";

function App() {
  const { userID, setUserID } = useCartStore();
  const [cookies] = useCookies(["access_token"]);
  const [loading, setLoading] = useState(true); // Add loading state
  const { userRole } = useAdminStore();
  console.log(userRole);

  useEffect(() => {
    if (!userID) {
      const storedUserID = window.localStorage.getItem("userID");
      if (storedUserID) {
        setUserID(storedUserID);
      }
    }
    setLoading(false);
  }, [userID, setUserID]);

  return (
    <div>
      {loading ? (
        <div className="w-[70%] sm:w-[80%] mt-[17%] mx-auto flex justify-center items-center">
          <ClipLoader color="#4A90E2" size={100} />
        </div>
      ) : (
        <div className="font-sans ">
          <Header />

          <Routes>
            <Route path="*" element={<NotFoundPage />} />
            <Route path="/" element={<Home />} />

            <Route path="/signup" element={<Signup />} />
            <Route path="/login" element={<Login />} />
            <Route path="/about" element={<AboutPage />} />
            <Route path="/contact" element={<ContactPage />} />

            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
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

          <Footer />
        </div>
      )}
      <Toaster />
    </div>
  );
}

export default App;
