import { productType } from "@/components/products/FlashSales";
import { CouponType } from "@/stores/cartStore";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";

interface ErrorMessageType {
  message: string;
}

interface UpdateCartParams {
  productID: string;
  quantity: number;
  access_token: string;
  userID: string | null;
}

// Fetch cart items
export const fetchCartItems = async (
  access_token: string,
  userID: string | null
) => {
  if (!userID) {
    toast.error("User ID is required to fetch cart items");
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/products/cart-items`,
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to fetch cart items:",
      err.response?.data || err.message,
      { id: "fetchCart" }
    );

    toast.error(err.response?.data?.message || "Failed to get items");
    throw err;
  }
};

//add to cart
export const addToCartAPI = async (
  product: productType,
  access_token: string,
  userID: string | null
): Promise<productType> => {
  try {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/products/add-to-cart`,
      { productID: product._id },
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
    return data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to fetch Add cart items:",
      err.response?.data || err.message,
      { id: "addItems" }
    );

    toast.error(err.response?.data?.message || "Failed to add item to cart");
    throw err;
  }
};

// Update cart item quantity
export const updateCartItemAPI = async ({
  productID,
  quantity,
  access_token,
  userID,
}: UpdateCartParams) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/products/update-cart/${productID}`,
      { quantity },
      {
        headers: { Authorization: access_token, userID },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to update cart items quantity:",
      err.response?.data || err.message,
      { id: "updateCart" }
    );
    toast.error(err.response?.data?.message || "Failed to update cart items");
    throw err;
  }
};

//Delete cart item

export const removeCartItemAPI = async ({
  productID,
  access_token,
  userID,
}: {
  productID: string;
  access_token: string;
  userID: string | null;
}) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/products/${productID}`,
      {
        headers: { Authorization: access_token, userID },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to update cart items quantity:",
      err.response?.data || err.message,
      { id: "deleteCartItem" }
    );
    toast.error(err.response?.data?.message || "Failed to fetch cart items");
    throw err;
  }
};

//clear cart
export const clearCart = async (access_token: string, userID: string) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/products/clear-cart`,
      {
        headers: { Authorization: access_token, userID },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to update cart items quantity:",
      err.response?.data || err.message,
      { id: "deleteCartItem" }
    );
    toast.error(err.response?.data?.message || "Failed to fetch cart items");
    throw err;
  }
};
//coupon

export const getCoupon = async (
  access_token: string,
  userID: string | null
): Promise<CouponType | null> => {
  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/coupons`,
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;
    toast.error(err.response?.data?.message || "Failed to get coupon");
    console.error("Error fetching coupon:", error);
    throw err;
  }
};

export const applyCoupon = async (
  code: string,
  access_token: string,
  userID: string | null
) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/coupons/validate`,
      { code },
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;
    toast.error(err.response?.data?.message || "Failed to apply coupon");
    throw err;
  }
};

//checkout

export const checkoutSuccess = async (
  sessionId: string,
  access_token: string,
  userID: string | null
) => {
  try {
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/payments/checkout-success`,
      {
        sessionId,
      },
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;
    toast.error(err.response?.data?.message || "Failed to checkout");
    throw err;
  }
};

//purchased items
export const getPurchasedItems = async (
  access_token: string,
  userID: string | null
) => {
  if (!userID) {
    toast.error("User ID is required to fetch cart items");
  }

  try {
    const res = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/products/purchased-items`,
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
    return res.data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to fetch cart items:",
      err.response?.data || err.message,
      { id: "fetchCart" }
    );

    toast.error(err.response?.data?.message || "Failed to get items");
    throw err;
  }
};

//get main page products

export const getProducts = async () => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/products`,
      {
        headers: { "Content-Type": "application/json" },
      }
    );

    return data;
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error(
      "Failed to fetch  items:",
      err.response?.data || err.message,
      { id: "fetchProducts" }
    );

    toast.error(err.response?.data?.message || "Failed to get products");
    throw err;
  }
};
