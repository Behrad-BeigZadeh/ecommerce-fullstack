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

  // Mutation for updating cart quantity
  const updateCartMutation = useMutation({
    mutationFn: ({ productID, quantity }: updateCartParams) =>
      updateCartItemAPI({
        productID,
        quantity,
        access_token: cookies.access_token,
        userID,
      }),
    onMutate: async ({ productID, quantity }) => {
      // Optimistically update cart quantity
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

      // Return the previous cart state for rolling back in case of error
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
      // Rollback to previous cart state if the mutation fails
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
      // Optimistically remove the item from Zustand store
      removeCartItem(productID);

      // Get the previous cart state
      const previousCart = queryClient.getQueryData<productType[]>([
        "cartItems",
        userID,
      ]);

      // Update cache optimistically
      queryClient.setQueryData(
        ["cartItems", userID],
        (oldCart: productType[] | undefined) =>
          oldCart ? oldCart.filter((item) => item._id !== productID) : []
      );

      // Return previous cart state in case of rollback
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
      // Rollback to previous cart state if mutation fails
      queryClient.setQueryData(["cartItems", userID], context?.previousCart);
    },

    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["cartItems", userID] });
      calculateTotals();
    },
  });

  // Function to trigger removal
  const deleteCartItem = (productID: string) => {
    removeCartMutation.mutate(productID);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1 }}
    >
      <div className=" hidden sm:grid grid-cols-4 grid-rows-1 mx-auto w-[65%] mr-[25%] text-center mt-10 border border-slate-100 font-bold p-3 shadow-md">
        <p className=" flex items-center justify-center">Product</p>
        <p className=" flex items-center justify-center">Price</p>
        <p className=" flex items-center justify-center">Quantity</p>
        <p className=" flex items-center justify-center">Subtotal</p>
      </div>

      {cartItems.map((cartItem) => {
        return (
          <div className="w-[70%] sm:w-[80%] mt-10 mx-auto" key={cartItem._id}>
            <div className="hidden sm:grid grid-cols-5 grid-rows-1 border border-slate-100 font-semibold p-3 shadow-md text-[12px] lg:text-base">
              <div className="flex items-center gap-2">
                <img
                  className="lg:w-20 lg:h-15 w-12 h-7"
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
            <div className="flex sm:hidden flex-col justify-center font-bold border border-slate-500 rounded-xl">
              <div className="bg-zinc-200 relative rounded-t-xl py-5 flex justify-center">
                <button
                  onClick={() => deleteCartItem(cartItem._id)}
                  className="absolute mr-[90%] text-red-600 text-3xl hover:text-red-700 cursor-pointer"
                >
                  <MdDelete />
                </button>
                <img
                  className="h-20 w-20"
                  src={cartItem.imageUrl}
                  alt="image"
                />
              </div>

              <div>
                <p className="font-semibold my-1.5 ml-2">{cartItem.name}</p>
                <div className="flex justify-between items-center mx-2">
                  <p>{cartItem.price}$</p>
                  <div className="flex items-center p-3">
                    <button
                      className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer m-2"
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
                      className="flex h-5 w-5 items-center justify-center rounded-md border border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer m-2"
                      onClick={() =>
                        updateCartItem(cartItem._id, cartItem.quantity + 1)
                      }
                    >
                      <FaPlus className="text-gray-300" />
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
