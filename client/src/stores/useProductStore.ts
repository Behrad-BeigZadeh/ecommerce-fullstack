import axios from "axios";
import toast from "react-hot-toast";
import { create } from "zustand";

export const useProductStore = create((set, get) => ({
  cart: [],

  getCartItems: async (cookies) => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/products/cart-items`,
        {
          headers: {
            authorization: cookies.access_token,
          },
        }
      );
      set({ cart: res.data });
    } catch (error) {
      set({ cart: [] });
      toast.error(error.response.data.message || "An error occurred");
    }
  },
  addToCart: async (product, userID, cookies) => {
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/products/add-to-cart`,
        { productId: product._id, userID },
        {
          headers: {
            "Content-Type": "application/json",
            authorization: cookies.access_token,
          },
        }
      );
      toast.success("Product added to cart");
      set((prev) => {
        const existingItem = prev.cart.find((item) => item._id === product._id);
        const newCart = existingItem
          ? prev.cart.map((item) =>
              item._id === product._id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            )
          : [...prev.cart, { ...product, quantity: 1 }];

        return { cart: newCart };
      });
    } catch (error) {
      toast.error(error.response.data.message || "An error occurred");
    }
  },
}));
