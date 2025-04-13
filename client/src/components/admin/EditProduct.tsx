import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect, useMemo } from "react";
import { FaSave, FaTrashAlt } from "react-icons/fa";
import { AxiosError } from "axios";
import { useCookies } from "react-cookie";
import useCartStore from "@/stores/cartStore";
import toast from "react-hot-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { deleteProduct, fetchProduct, updateProduct } from "@/api/adminApi";
import { ErrorResponse } from "../products/FlashSalesProduct";
import { ClipLoader } from "react-spinners";

export type EditProductFormType = {
  _id: string;
  name: string;
  imageUrl: string;
  price: string;
  previousPrice: string;
  stockQuantity: string;
  offPercent: string;
};

const EditProduct = () => {
  const { id } = useParams();
  const [cookies] = useCookies(["access_token"]);
  const { userID } = useCartStore();
  const [product, setProduct] = useState<EditProductFormType | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [actionType, setActionType] = useState<"save" | "delete" | null>(null);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, error, isLoading } = useQuery({
    queryKey: ["All-products", id],
    queryFn: () => fetchProduct(cookies.access_token, userID, id),
  });
  useEffect(() => {
    if (data) {
      setProduct(data);
    }
  }, [data]);

  useEffect(() => {
    if (error) {
      toast.error(error.message);
    }
  }, [error]);

  const updateMutation = useMutation({
    mutationFn: async (id: string) =>
      updateProduct(cookies.access_token, userID, id, product),
    onSuccess: () => {
      toast.success("Product updated successfully");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["All-products", id] });
      navigate("/admin-dashboard");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setShowModal(false);
      console.error("Error updating product", error);
      toast.error(error?.response?.data.message || "An error occurred", {
        id: "update_product",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async (id: string) =>
      deleteProduct(cookies.access_token, userID, id),
    onSuccess: () => {
      toast.success("Product deleted successfully");
      setShowModal(false);
      queryClient.invalidateQueries({ queryKey: ["All-products", id] });
      navigate("/admin-dashboard");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      setShowModal(false);
      console.error("Error deleting product", error);
      toast.error(error?.response?.data.message || "An error occurred", {
        id: "delete_product",
      });
    },
  });

  const handleUpdate = async (id: string) => {
    updateMutation.mutate(id);
  };
  const handleDelete = async () => {
    deleteMutation.mutate(id!);
  };

  const openModal = (action: "save" | "delete") => {
    setActionType(action);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: string
  ) => {
    const value = e.target.value;
    if (!product) return;
    const newProduct = {
      ...product,
      [field]: value === "" ? null : value,
    };

    setProduct(newProduct);
  };
  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-[70%] sm:w-[80%] mt-10 mx-auto flex justify-center">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      );
    }

    return (
      <div className="container mx-auto p-6">
        {product && (
          <div className="bg-white shadow-lg rounded-lg p-8">
            <h2 className="text-3xl font-semibold mb-6">Edit Product</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">
                  Product Name:
                </label>
                <input
                  type="text"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                  value={product.name}
                  onChange={(e) =>
                    setProduct({ ...product, name: e.target.value })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">Price:</label>
                <input
                  type="number"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                  value={product.price}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      price: e.target.value.replace(/^0+(?=\d)/, "") || "",
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">
                  Stock Quantity:
                </label>
                <input
                  type="number"
                  inputMode="numeric"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                  value={product.stockQuantity}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      stockQuantity:
                        e.target.value.replace(/^0+(?=\d)/, "") || "",
                    })
                  }
                />
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">
                  Previous Price:
                </label>
                <input
                  type="number"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                  value={product.previousPrice}
                  onChange={(e) => handleChange(e, "previousPrice")}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">
                  Discount Percentage:
                </label>
                <input
                  type="number"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                  value={product.offPercent}
                  onChange={(e) => handleChange(e, "offPercent")}
                />
              </div>

              <div className="flex flex-col">
                <label className="text-lg font-medium mb-2">Image URL:</label>
                <input
                  type="text"
                  className="border p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-slate-800"
                  value={product.imageUrl}
                  onChange={(e) =>
                    setProduct({ ...product, imageUrl: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="flex justify-between mt-6">
              <button
                className="bg-slate-800 hover:bg-slate-950 text-white p-3 rounded-lg flex items-center gap-2"
                onClick={() => openModal("save")}
              >
                <FaSave /> Save Changes
              </button>

              <button
                className="bg-red-500 hover:bg-red-600 text-white p-3 rounded-lg flex items-center gap-2"
                onClick={() => openModal("delete")}
              >
                <FaTrashAlt /> Delete Product
              </button>
            </div>
          </div>
        )}

        {/* Modal for confirmation */}
        {showModal && (
          <div className="fixed inset-0 bg-gray-600/50 flex justify-center items-center">
            <div className="bg-white p-8 rounded-lg shadow-lg max-w-sm w-full">
              <h3 className="text-lg font-semibold mb-4">
                {actionType === "save"
                  ? "Save Changes?"
                  : "Are you sure you want to delete this product?"}
              </h3>
              <div className="flex justify-end gap-4">
                <button
                  className={`${actionType === "save" ? "bg-red-500 hover:bg-red-600" : "bg-slate-800 hover:bg-slate-900"} text-white px-4 py-2 rounded-lg`}
                  onClick={closeModal}
                >
                  Cancel
                </button>
                <button
                  className={`text-white px-4 py-2 rounded-lg ${
                    actionType === "save"
                      ? "bg-slate-800 hover:bg-slate-950"
                      : "bg-red-500 hover:bg-red-600"
                  }`}
                  onClick={() => {
                    if (actionType === "save") {
                      handleUpdate(id!);
                    } else if (actionType === "delete") {
                      handleDelete();
                    }
                  }}
                >
                  {actionType === "save" ? "Save" : "Delete"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  }, [
    id,
    product,
    isLoading,
    error,
    cookies.access_token,
    userID,
    handleUpdate,
    handleDelete,
  ]);
  return <>{content}</>;
};

export default EditProduct;
