import { productType } from "./FlashSales";
import { FaStar } from "react-icons/fa6";
import { useCartStore } from "@/stores/cartStore";
import { useCookies } from "react-cookie";
import { AxiosError } from "axios";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { addToCartAPI } from "../../api/api";

export interface Props {
  product: productType;
}
export interface ErrorResponse {
  message?: string;
  error?: string;
}

export default function FlashSalesProduct(props: Props) {
  const { addToCart, userID } = useCartStore();
  const [cookies] = useCookies(["access_token"]);
  const { offPercent, imageUrl, price, name, previousPrice, stockQuantity } =
    props.product;
  const navigate = useNavigate();
  const product = props.product;
  const queryClient = useQueryClient();

  const mutation = useMutation<
    productType,
    AxiosError<ErrorResponse>,
    productType
  >({
    mutationFn: () => addToCartAPI(product, cookies.access_token, userID),
    onSuccess: () => {
      addToCart(product);
      toast.success("Product added to cart");
      queryClient.invalidateQueries({ queryKey: ["cartItems", userID] });
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 429) {
        toast.error(
          error.response?.data?.error ||
            "Too many requests, please try again later.",
          { id: "add_product" }
        );
        return;
      }
      toast.error(error?.response?.data.message || "An error occurred", {
        id: "add_product",
      });
    },
  });

  const handleAddToCart = () => {
    if (!cookies.access_token && !userID) {
      toast.error("Login to be able to add products to your cart", {
        id: "add_product",
      });
      navigate("/login");
    }
    mutation.mutate(product);
  };

  return (
    <div className="w-200  flex flex-col justify-center  max-w-[80%]   mx-auto">
      <div className="bg-white shadow-md rounded-lg  flex flex-col justify-center items-center rounded-t-xl p-5 ">
        <p className="bg-red-500  mr-[90%] -mt-[5%] font-semibold rounded-md p-1 text-zinc-300">
          -{offPercent}%
        </p>
        <img className="h-30" src={imageUrl} alt="image" />
      </div>

      {stockQuantity > 0 && (
        <button
          onClick={handleAddToCart}
          className="w-full rounded-b-xl  text-center p-2 bg-black text-zinc-300 text-xl cursor-pointer hover:bg-zinc-800  font-semibold"
        >
          Add To Cart
        </button>
      )}
      <div className="flex justify-between ">
        <div>
          <p className="font-semibold my-1.5">{name}</p>
          <div className="flex ">
            <p className="text-red-500 font-medium">{price}$</p>
            <p className="text-zinc-500 line-through px-3 font-medium">
              {previousPrice}$
            </p>
          </div>
          <div className="text-amber-300 flex mt-1.5">
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
            <FaStar />
          </div>
        </div>
        <div>
          {stockQuantity > 0 ? (
            <p className="text-zinc-500 font-medium text-sm my-2">
              {stockQuantity} items left
            </p>
          ) : (
            <p className="text-red-500 font-medium text-sm my-2">
              Out of stock
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
