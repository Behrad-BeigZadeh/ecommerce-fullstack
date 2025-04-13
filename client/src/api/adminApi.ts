import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { ErrorMessageType } from "./api";

import { EditProductFormType } from "@/components/admin/EditProduct";
import { NewProductFormType } from "@/components/admin/AddProduct";

export const getAllProducts = async (access_token: string, userID: string) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/products/admin`,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: access_token,
          userID,
        },
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

export const fetchProduct = async (
  access_token: string,
  userID: string,
  id: string | undefined
) => {
  try {
    const { data } = await axios.get(
      `${import.meta.env.VITE_BASE_URL}/api/products/admin/${id}`,
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

    console.error("Failed to fetch item:", err.response?.data || err.message);

    toast.error(err.response?.data?.message || "Failed to get product");
    throw err;
  }
};

export const updateProduct = async (
  access_token: string,
  userID: string,
  id: string,
  product: EditProductFormType | null
) => {
  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/products/admin/${id}`,
      {
        product,
      },
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error("Failed to update  item:", err.response?.data || err.message);

    toast.error(err.response?.data?.message || "Failed to update product");
    throw err;
  }
};

export const addProduct = async (
  access_token: string,
  userID: string,
  newProduct: NewProductFormType
) => {
  console.log(newProduct);
  try {
    await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/products/admin/add-product`,
      {
        product: newProduct,
      },
      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error("Failed to add item:", err.response?.data || err.message);

    toast.error(err.response?.data?.message || "Failed to add product");
    throw err;
  }
};

export const deleteProduct = async (
  access_token: string,
  userID: string,
  id: string
) => {
  try {
    await axios.delete(
      `${import.meta.env.VITE_BASE_URL}/api/products/admin/${id}`,

      {
        headers: {
          Authorization: access_token,
          userID,
        },
      }
    );
  } catch (error) {
    const err = error as AxiosError<ErrorMessageType>;

    console.error("Failed to delete  item:", err.response?.data || err.message);

    toast.error(err.response?.data?.message || "Failed to delete product");
    throw err;
  }
};
