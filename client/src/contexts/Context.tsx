import axios from "axios";
import { createContext, useContext, useState } from "react";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";

export const shopContext = createContext(null);

export const ShopContextProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  const userID = window.localStorage.getItem("userID");
  const [cookies] = useCookies(["access_token"]);

  const addToCart = async (product) => {
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

      const newItem = res.data.map((item) =>
        item.quantity === 0 ? { quantity: 1 } : { quantity: item.quantity + 1 }
      );
      setCart(newItem);
    } catch (error) {
      console.log("error in add cart items", error);

      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const updateCartItem = async (productID, quantity) => {
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
    } catch (error) {
      console.log("error in update cart items", error);

      toast.error(error.response.data.message || "An error occurred");
    }
  };

  const removeCartItem = async (productID) => {
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
      toast.success("Product Deleted Successfully");
    } catch (error) {
      console.log("error in remove cart items", error);

      toast.error(error.response.data.message || "An error occurred");
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
      setCart(res.data);
    } catch (error) {
      console.log("error in get cart items", error);
      toast.error(error.response.data.message || "An error occurred");
    }
  };

  return (
    <shopContext.Provider
      value={{ addToCart, getCartItems, cart, updateCartItem, removeCartItem }}
    >
      {children}
    </shopContext.Provider>
  );
};

export const useShopContext = () => {
  const context = useContext(shopContext);
  return context;
};
