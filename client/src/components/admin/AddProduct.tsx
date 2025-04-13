import React, { useState } from "react";
import { productType } from "../products/FlashSales";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ErrorResponse } from "../products/FlashSalesProduct";
import { AxiosError } from "axios";
import toast from "react-hot-toast";
import useCartStore from "@/stores/cartStore";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";
import { addProduct } from "@/api/adminApi";

// Use string values for inputs, we'll convert to number later
export type NewProductFormType = Omit<
  productType,
  | "_id"
  | "quantity"
  | "price"
  | "stockQuantity"
  | "previousPrice"
  | "offPercent"
> & {
  price: string;
  previousPrice: string;
  offPercent: string;
  stockQuantity: string;
};

const AddProduct = () => {
  const [cookies] = useCookies(["access_token"]);
  const { userID } = useCartStore();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [newProduct, setNewProduct] = useState<NewProductFormType>({
    name: "",
    imageUrl: "",
    price: "",
    previousPrice: "",
    stockQuantity: "",
    offPercent: "",
  });

  const mutation = useMutation({
    mutationFn: () => {
      const productToSubmit: Omit<productType, "_id" | "quantity"> = {
        name: newProduct.name,
        imageUrl: newProduct.imageUrl,
        price: Number(newProduct.price),
        previousPrice:
          newProduct.previousPrice === ""
            ? null
            : Number(newProduct.previousPrice),
        stockQuantity:
          newProduct.stockQuantity === ""
            ? 0
            : Number(newProduct.stockQuantity),
        offPercent:
          newProduct.offPercent === "" ? null : Number(newProduct.offPercent),
      };

      return addProduct(cookies.access_token, userID, productToSubmit);
    },
    onSuccess: () => {
      toast.success("Product added successfully");
      queryClient.invalidateQueries({ queryKey: ["All-products"] });
      navigate("/admin-dashboard");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data.message || "An error occurred", {
        id: "add_product",
      });
    },
  });

  const handleAddProduct = () => {
    mutation.mutate();
  };

  return (
    <div className="bg-white shadow-lg rounded-lg p-8">
      <h2 className="text-3xl font-semibold mb-6">Add Product</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {/* Product Name */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Product Name:</label>
          <input
            type="text"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            value={newProduct.name}
            onChange={(e) =>
              setNewProduct({ ...newProduct, name: e.target.value })
            }
          />
        </div>

        {/* Price */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Price:</label>
          <input
            type="text"
            inputMode="numeric"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            value={newProduct.price}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                price: e.target.value.replace(/^0+(?=\d)/, ""),
              })
            }
          />
        </div>

        {/* Stock Quantity */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Stock Quantity:</label>
          <input
            type="number"
            inputMode="numeric"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            value={newProduct.stockQuantity}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                stockQuantity: e.target.value.replace(/^0+(?=\d)/, "") || "",
              })
            }
          />
        </div>

        {/* Previous Price */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Previous Price:</label>
          <input
            type="text"
            inputMode="numeric"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            value={newProduct.previousPrice}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                previousPrice: e.target.value.replace(/^0+(?=\d)/, "") || "",
              })
            }
          />
        </div>

        {/* Discount Percentage */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">
            Discount Percentage:
          </label>
          <input
            type="text"
            inputMode="numeric"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            value={newProduct.offPercent}
            onChange={(e) =>
              setNewProduct({
                ...newProduct,
                offPercent: e.target.value.replace(/^0+(?=\d)/, "") || "",
              })
            }
          />
        </div>

        {/* Image URL */}
        <div className="flex flex-col">
          <label className="text-lg font-medium mb-2">Image URL:</label>
          <input
            type="text"
            className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
            value={newProduct.imageUrl}
            onChange={(e) =>
              setNewProduct({ ...newProduct, imageUrl: e.target.value })
            }
          />
        </div>
      </div>

      {/* Submit Button */}
      <button
        onClick={handleAddProduct}
        disabled={mutation.isPending}
        className="bg-slate-900 hover:bg-slate-950 text-slate-200 flex justify-center items-center p-2 mx-auto mt-10 rounded-md cursor-pointer w-30 sm:w-40 whitespace-nowrap"
      >
        {mutation.isPending ? "Adding..." : "Add Product"}
      </button>
    </div>
  );
};

export default AddProduct;
