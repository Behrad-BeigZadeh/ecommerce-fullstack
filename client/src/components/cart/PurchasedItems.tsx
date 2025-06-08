import useCartStore from "@/stores/cartStore";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import { addToCartAPI, getPurchasedItems } from "../../api/api";
import toast from "react-hot-toast";
import { useCookies } from "react-cookie";
import { productType } from "../products/FlashSales";
import { ErrorResponse } from "../products/FlashSalesProduct";
import { AxiosError } from "axios";
import useSearchStore from "@/stores/searchStore";

const PurchasedItems = () => {
  const [purchasedItems, setPurchasedItems] = useState<productType[]>([]);
  const { searchQuery } = useSearchStore();
  const [cookies] = useCookies(["access_token"]);
  const { addToCart, userID } = useCartStore();

  const { data, isError, error } = useQuery({
    queryKey: ["purchasedItems", userID],
    queryFn: () => getPurchasedItems(cookies.access_token, userID),
  });

  useEffect(() => {
    if (data) {
      setPurchasedItems(data);
    }
  }, [data]);

  if (isError) {
    toast.error(error.message || "Failed to get purchased items");
  }

  const queryClient = useQueryClient();

  const mutation = useMutation<
    productType,
    AxiosError<ErrorResponse>,
    productType
  >({
    mutationFn: (product) =>
      addToCartAPI(product, cookies.access_token, userID),
    onSuccess: (product) => {
      addToCart(product);
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cartItems", userID] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error?.response?.data?.message || "An error occurred");
    },
  });

  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item: productType) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);
  return (
    <motion.div
      className="max-w-6xl mx-auto p-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1 }}
    >
      <h2 className="text-2xl font-bold mb-8">Purchased Items</h2>
      {purchasedItems.length === 0 ? (
        <p className="text-gray-500">No purchased items yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredData.map((item: productType) => (
            <div key={item._id} className="bg-white shadow-md rounded-lg p-4 ">
              <div className="flex mx-auto justify-center">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-30  rounded-md"
                />
              </div>

              <h3 className="text-lg font-semibold mt-2">{item.name}</h3>
              <p className="text-red-500 font-medium">${item.price}</p>
              <button
                onClick={() => mutation.mutate(item)}
                className="mt-3 w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 transition cursor-pointer"
              >
                Buy Again
              </button>
            </div>
          ))}
        </div>
      )}
    </motion.div>
  );
};

export default PurchasedItems;
