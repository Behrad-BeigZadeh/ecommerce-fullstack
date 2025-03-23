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
import { ShopContextProvider } from "./contexts/Context";
import { useCookies } from "react-cookie";

function App() {
  const [cookies] = useCookies(["access_token"]);
  return (
    <div className="font-mono">
      <ShopContextProvider>
        <Header />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/login" element={<Login />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route
            path="/cart-items"
            element={
              cookies.access_token ? <CartItems /> : <Navigate to="/login" />
            }
          />
        </Routes>
        <Footer />
        <Toaster />
      </ShopContextProvider>
    </div>
  );
}

export default App;
