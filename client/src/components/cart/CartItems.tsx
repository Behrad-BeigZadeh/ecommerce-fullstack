import { useEffect, useMemo } from "react";
import CartItemPage from "./CartItemPage";
import { LuPackageOpen } from "react-icons/lu";
import { useCartStore } from "@/stores/cartStore";
import { useCookies } from "react-cookie";
import { useQuery } from "@tanstack/react-query";
import toast from "react-hot-toast";
import { ClipLoader } from "react-spinners";
import { fetchCartItems } from "../../api/api";

const CartItems = () => {
  const { cartItems, setCartItems, userID, calculateTotals } = useCartStore();
  const [cookies] = useCookies(["access_token"]);
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["cartItems", userID],
    queryFn: () => fetchCartItems(cookies.access_token, userID),
    enabled: !!userID && !!cookies.access_token,
  });

  useEffect(() => {
    if (data && JSON.stringify(data) !== JSON.stringify(cartItems)) {
      setCartItems(data);
      calculateTotals();
    }
  }, [data, setCartItems, cartItems, calculateTotals]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-[70%] sm:w-[80%] mt-10 mx-auto flex justify-center">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      );
    }

    if (isError) {
      toast.error(error?.message || "Failed to fetch cart items", {
        id: "fetchCart",
      });
      return (
        <div className="text-center text-red-500 font-semibold mt-4">
          Error loading cart. Please try again.
        </div>
      );
    }

    if (cartItems.length > 0) {
      return <CartItemPage />;
    }

    return (
      <div className="flex flex-col justify-center items-center mx-auto h-96 space-y-4">
        <div className="bg-base-100 rounded-full">
          <LuPackageOpen className="size-20" />
        </div>
        <div className="text-center space-y-2">
          <h3 className="text-2xl font-semibold">No products found</h3>
          <p className="text-gray-600 max-w-sm">
            Get started by adding your first product to the cart.
          </p>
        </div>
      </div>
    );
  }, [isLoading, isError, error, cartItems]);

  return <>{content}</>;
};

export default CartItems;
