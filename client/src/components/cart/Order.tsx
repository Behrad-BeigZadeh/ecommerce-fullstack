import useCartStore from "@/stores/cartStore";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import { useState } from "react";

const stripePromise = loadStripe(
  String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
);

const Order = () => {
  const { total, subtotal, coupon, isCouponApplied, cartItems, userID } =
    useCartStore();
  const [cookies] = useCookies(["access_token"]);
  const [isRedirecting, setIsRedirecting] = useState(false);

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);

  const { mutate: handleCheckout } = useMutation({
    mutationFn: async () => {
      setIsRedirecting(true);

      const stripe = await stripePromise;

      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/payments/create-checkout-session`,
        {
          products: cartItems,
          couponCode: coupon ? coupon.code : null,
        },
        {
          headers: {
            Authorization: cookies.access_token,
            userID,
          },
        }
      );

      const session = res.data;

      const result = await stripe?.redirectToCheckout({
        sessionId: session.id,
      });

      if (result?.error) {
        setIsRedirecting(false);
        toast.error("Checkout was cancelled");
      }
    },
    onError: () => {
      setIsRedirecting(false);
      toast.error("Error finalizing order");
    },
    onSettled: () => {
      setIsRedirecting(false);
    },
  });

  return (
    <div className="w-full lg:w-[60%] rounded-2xl border border-slate-300 p-5 shadow-md bg-white">
      <h2 className="text-lg font-semibold text-gray-800 mb-4 text-center">
        Cart Summary
      </h2>

      <div className="space-y-3 text-sm text-gray-700">
        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span>Subtotal</span>
          <span>${formattedSubtotal}</span>
        </div>

        <div className="flex justify-between border-b border-slate-200 pb-2">
          <span>Shipping</span>
          <span className="capitalize">Free</span>
        </div>

        {coupon && isCouponApplied && savings > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Savings</span>
            <span>-${formattedSavings}</span>
          </div>
        )}

        {coupon && isCouponApplied && (
          <div className="flex justify-between border-b border-slate-200 pb-2">
            <span className="text-gray-700">
              Coupon{" "}
              <span className="font-medium text-gray-900">({coupon.code})</span>
            </span>
            <span className="text-red-500 font-semibold">
              -{coupon.discountPercentage}%
            </span>
          </div>
        )}

        <div className="flex justify-between font-semibold text-base text-gray-900 mt-4">
          <span>Total</span>
          <span>${formattedTotal}</span>
        </div>
      </div>

      <button
        onClick={() => handleCheckout()}
        disabled={isRedirecting}
        className="mt-6 w-full rounded-md bg-red-500 py-2.5 text-sm font-semibold text-white hover:bg-red-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isRedirecting ? "Redirecting..." : "Proceed to Checkout"}
      </button>
    </div>
  );
};

export default Order;
