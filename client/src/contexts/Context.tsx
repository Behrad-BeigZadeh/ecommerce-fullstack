import { productType } from "@/components/products/FlashSales";
import axios from "axios";
import React, { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type CouponType = {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userID: string;
};

export interface ShopContextType {
  cart: [] | productType[];
  total: number;
  subtotal: number;
  coupon: null | CouponType;
  isCouponApplied: boolean;
  addToCart: (product: productType) => void;
  updateCartItem: (productID: string, quantity: number) => void;
  clearCart: () => void;
  removeCartItem: (productID: string) => void;
  getCartItems: () => void;
  getCoupon: () => void;
  removeCoupon: () => void;
  applyCoupon: (code: string) => void;
}

const defaultValue: ShopContextType = {
  cart: [],
  total: 0,
  subtotal: 0,
  coupon: null,
  isCouponApplied: false,
  addToCart: () => null,
  updateCartItem: () => null,
  clearCart: () => null,
  removeCartItem: () => null,
  getCartItems: () => null,
  getCoupon: () => null,
  removeCoupon: () => null,
  applyCoupon: () => null,
};

export const shopContext = createContext<ShopContextType>(defaultValue);

export const ShopContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [cart, setCart] = useState([]);

  const [total, setTotal] = useState(0);
  const [subtotal, setSubtotal] = useState(0);
  const [coupon, setCoupon] = useState(null);
  const [isCouponApplied, setIsCouponApplied] = useState(false);

  const userID = window.localStorage.getItem("userID");
  const [cookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const addToCart = async (product: productType) => {
    if (!cookies.access_token) {
      toast.error("Login to be able to add products to your cart", {
        id: "add_product",
      });
      navigate("/login");
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/add-to-cart`,
        { productID: product._id },
        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );
      toast.success("Product added to cart");

      const newItem = res.data.map((item: productType) =>
        item.quantity === 0 ? { quantity: 1 } : { quantity: item.quantity + 1 }
      );
      setCart(newItem);
      calculateTotals();
    } catch (error) {
      console.log("error in add cart items", error);

      toast.error(error.response.data.message || "An error occurred", {
        id: "add_product",
      });
    }
  };

  const updateCartItem = async (productID: string, quantity: number) => {
    try {
      await axios.post(
        `${
          import.meta.env.VITE_BASE_URL
        }/api/products/update-cart/${productID}`,
        { quantity },

        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );
      toast.success("Product Updated Successfully");
      getCartItems();
      calculateTotals();
    } catch (error) {
      console.log("error in update cart items", error);

      toast.error(error.response.data.message || "An error occurred", {
        id: "update_product",
      });
    }
  };

  const clearCart = async () => {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/products/clear-cart`,
      {
        headers: {
          Authorization: cookies.access_token,
          userID,
        },
      }
    );
    setCart([]);
    setCoupon(null);
    setTotal(0);
    setSubtotal(0);
  };

  const removeCartItem = async (productID: string) => {
    try {
      await axios.delete(
        `${import.meta.env.VITE_BASE_URL}/api/products/${productID}`,

        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );
      getCartItems();
      calculateTotals();

      toast.success("Product Deleted Successfully");
    } catch (error) {
      console.log("error in remove cart items", error);

      toast.error(error.response.data.message || "An error occurred", {
        id: "remove_product",
      });
    }
  };

  const getCartItems = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/products/cart-items`,
        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );
      console.log(res.data);

      setCart(res.data);

      calculateTotals();
    } catch (error) {
      console.log("error in get cart items", error);
      toast.error(error.response.data.message || "An error occurred", {
        id: "get_items",
      });
    }
  };

  const getCoupon = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/coupons`,
        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );
      setCoupon(res.data);
    } catch (error) {
      console.error("Error fetching coupon:", error);
    }
  };

  const applyCoupon = async (code: string) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/coupons/validate`,
        { code },
        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );
      setCoupon(res.data);
      setIsCouponApplied(true);
      calculateTotals();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to apply coupon");
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setIsCouponApplied(false);
    calculateTotals();
    toast.success("Coupon removed");
  };

  const calculateTotals = () => {
    console.log(cart);
    const calculate = cart.reduce(
      (sum, item: productType) => sum + item.price * item.quantity,
      0
    );

    setSubtotal(calculate);

    setTotal(subtotal);
    console.log(total);
    if (coupon) {
      const discount = subtotal * (coupon.discountPercentage / 100);
      setTotal(subtotal - discount);
    }
  };

  return (
    <shopContext.Provider
      value={{
        addToCart,
        getCartItems,
        cart,
        updateCartItem,
        removeCartItem,
        subtotal,
        total,
        coupon,
        isCouponApplied,
        getCoupon,
        applyCoupon,
        removeCoupon,
        clearCart,
      }}
    >
      {children}
    </shopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(shopContext);
  return context;
};
