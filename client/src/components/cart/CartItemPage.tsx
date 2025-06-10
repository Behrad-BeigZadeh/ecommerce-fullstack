import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import GiftCouponCard from "./GiftCouponCard";
import Order from "./Order";
import { productType } from "../products/FlashSales";
import { removeCartItemAPI, updateCartItemAPI } from "../../api/api";
import { useCartStore } from "@/stores/cartStore";
import { AxiosError } from "axios";
import { ErrorResponse } from "../products/FlashSalesProduct";

interface updateCartParams {
  productID: string;
  quantity: number;
}

const CartItemPage = () => {
  const {
    updateCartQuantity,
    cartItems,
    userID,
    removeCartItem,
    calculateTotals,
  } = useCartStore();
  const [cookies] = useCookies(["access_token"]);
  const queryClient = useQueryClient();

  const updateCartMutation = useMutation({
    mutationFn: ({ productID, quantity }: updateCartParams) =>
      updateCartItemAPI({
        productID,
        quantity,
        access_token: cookies.access_token,
        userID,
      }),
    onMutate: async ({ productID, quantity }) => {
      updateCartQuantity(productID, quantity);

      const previousCart = queryClient.getQueryData<productType[]>([
        "cartItems",
        userID,
      ]);

      queryClient.setQueryData(
        ["cartItems", userID],
        (oldCart: productType[] | undefined) =>
          oldCart
            ? oldCart.map((cartItem) =>
                cartItem._id === productID
                  ? { ...cartItem, quantity }
                  : cartItem
              )
            : []
      );

      return { previousCart };
    },
    onError: (err: AxiosError<ErrorResponse>, _, context) => {
      if (err.response?.status === 429) {
        toast.error(
          err.response?.data?.error ||
            "Too many requests, please try again later.",
          { id: "add_product" }
        );
      }
      toast.error("Failed to update cart!", { id: "add_product" });

      queryClient.setQueryData(["cartItems", userID], context?.previousCart);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems", userID] });
      calculateTotals();
    },
  });

  const updateCartItem = (productID: string, newQuantity: number) => {
    updateCartMutation.mutate({ productID, quantity: newQuantity });
  };

  const removeCartMutation = useMutation({
    mutationFn: (productID: string) =>
      removeCartItemAPI({
        productID,
        access_token: cookies.access_token,
        userID,
      }),

    onMutate: async (productID) => {
      removeCartItem(productID);

      const previousCart = queryClient.getQueryData<productType[]>([
        "cartItems",
        userID,
      ]);

      queryClient.setQueryData(
        ["cartItems", userID],
        (oldCart: productType[] | undefined) =>
          oldCart ? oldCart.filter((item) => item._id !== productID) : []
      );

      return { previousCart };
    },

    onError: (err: AxiosError<ErrorResponse>, _, context) => {
      if (err.response?.status === 429) {
        toast.error(
          err.response?.data?.error ||
            "Too many requests, please try again later.",
          { id: "add_product" }
        );
      }
      toast.error("Failed to remove item from cart!");

      queryClient.setQueryData(["cartItems", userID], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems", userID] });
      calculateTotals();
    },
  });

  const deleteCartItem = (productID: string) => {
    removeCartMutation.mutate(productID);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1 }}
      className="w-full px-4 sm:px-0"
    >
      <div className=" hidden sm:grid grid-cols-5 grid-rows-1 mx-auto w-[80%]  text-center mt-10 border border-slate-100 font-bold p-3 shadow-md">
        <p className=" flex items-center justify-center">Product</p>
        <p className=" flex items-center justify-center">Price</p>
        <p className=" flex items-center justify-center">Quantity</p>
        <p className=" flex items-center justify-center">Subtotal</p>
      </div>

      {cartItems.map((cartItem) => {
        return (
          <div
            className=" sm:w-[80%] mt-10 mx-auto hover:scale-105 transition duration-400"
            key={cartItem._id}
          >
            <div className="hidden sm:grid grid-cols-5 grid-rows-1 border border-slate-100 font-semibold p-3 shadow-md text-[12px] lg:text-base">
              <div className="flex items-center gap-2">
                <img
                  className="lg:w-23 lg:h-18 w-12 h-7 object-contain"
                  src={cartItem.imageUrl}
                  alt="image"
                />
                <p>{cartItem.name}</p>
              </div>
              <p className="flex items-center justify-center">
                {cartItem.price}
              </p>
              <div className="flex items-center gap-2 justify-center">
                <button
                  className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer"
                  onClick={() =>
                    cartItem.quantity === 1
                      ? deleteCartItem(cartItem._id)
                      : updateCartItem(cartItem._id, cartItem.quantity - 1)
                  }
                >
                  <FaMinus className="text-gray-300" />
                </button>
                <p>{cartItem.quantity}</p>
                <button
                  className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer"
                  onClick={() =>
                    updateCartItem(cartItem._id, cartItem.quantity + 1)
                  }
                >
                  <FaPlus className="text-gray-300" />
                </button>
              </div>
              <p className="flex items-center justify-center">
                {Math.floor(cartItem.quantity * cartItem.price)}
              </p>
              <button
                onClick={() => deleteCartItem(cartItem._id)}
                className="flex items-center justify-center text-red-600 text-xl hover:text-red-700 cursor-pointer"
              >
                <MdDelete />
              </button>
            </div>

            {/* Mobile Responsive */}
            <div className="w-[85%] mx-auto mt-6 flex sm:hidden flex-col rounded-xl border border-slate-300 shadow-md overflow-hidden bg-white">
              {/* Image & Delete */}
              <div className="relative bg-zinc-100 py-4 flex justify-center items-center">
                <button
                  onClick={() => deleteCartItem(cartItem._id)}
                  className="absolute left-3 top-3 text-red-600 hover:text-red-700"
                >
                  <MdDelete className="text-3xl" />
                </button>
                <img
                  className="h-24 w-24 object-contain"
                  src={cartItem.imageUrl}
                  alt="product"
                />
              </div>

              {/* Details */}
              <div className="p-4 space-y-3 text-sm text-gray-700">
                <p className="font-semibold text-base text-gray-900 truncate">
                  {cartItem.name}
                </p>

                <div className="flex justify-between items-center">
                  <p className="text-green-600 font-semibold">
                    ${cartItem.price}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      className="h-6 w-6 flex items-center justify-center rounded-md border border-slate-400 bg-slate-900 hover:bg-slate-700"
                      onClick={() =>
                        cartItem.quantity === 1
                          ? deleteCartItem(cartItem._id)
                          : updateCartItem(cartItem._id, cartItem.quantity - 1)
                      }
                    >
                      <FaMinus className="text-white text-xs" />
                    </button>
                    <p className="font-medium text-sm">{cartItem.quantity}</p>
                    <button
                      className="h-6 w-6 flex items-center justify-center rounded-md border border-slate-400 bg-slate-900 hover:bg-slate-700"
                      onClick={() =>
                        updateCartItem(cartItem._id, cartItem.quantity + 1)
                      }
                    >
                      <FaPlus className="text-white text-xs" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })}

      <div className="sm:w-[60%] w-[60%] mt-10 gap-5 flex flex-col sm:flex-row sm:items-start sm:justify-end mx-auto sm:mr-[10%]">
        <GiftCouponCard />
        <Order />
      </div>
    </motion.div>
  );
};

export default CartItemPage;
