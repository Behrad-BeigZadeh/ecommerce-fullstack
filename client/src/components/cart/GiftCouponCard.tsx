import useCartStore from "@/stores/cartStore";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { applyCoupon, getCoupon } from "../../api/api";
import { useCookies } from "react-cookie";
import toast from "react-hot-toast";
import { AxiosError } from "axios";
import { ErrorResponse } from "../products/FlashSalesProduct";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const [cookies] = useCookies(["access_token"]);
  const {
    userID,
    calculateTotals,
    setCoupon,
    isCouponApplied,
    setIsCouponApplied,
    coupon,
    removeCoupon,
  } = useCartStore();

  const { data, isError, error } = useQuery({
    queryKey: ["coupon", userID],
    queryFn: () => getCoupon(cookies.access_token, userID),
    enabled: !!userID && !!cookies.access_token,
  });

  const mutation = useMutation({
    mutationFn: (code: string) =>
      applyCoupon(code, cookies.access_token, userID),
    onSuccess: () => {
      if (data) {
        // Check if data is defined
        toast.success("Coupon applied", { id: "applyCoupon" });
        setCoupon(data);
        setIsCouponApplied(true);
        calculateTotals();
      } else {
        toast.error("Coupon data is invalid.");
      }
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 429) {
        toast.error(
          error.response?.data?.error ||
            "Too many requests, please try again later.",
          { id: "applyCoupon" }
        );
      }
      toast.error("Failed to apply coupon");
      console.error("apply coupon Mutation error:", error);
      setIsCouponApplied(false);
    },
  });

  useEffect(() => {
    if (isError) {
      console.error("get coupon error:", error);
      toast.error("Failed to get coupon");
    }
  }, [isError, error]);

  useEffect(() => {
    if (coupon && coupon.isActive) {
      setUserInputCode(coupon.code);
    }
  }, [coupon]);

  useEffect(() => {
    if (data) {
      setCoupon(data);
      calculateTotals();
    } else if (data === null) {
      setCoupon(null);
      calculateTotals();
    }
  }, [data, setCoupon, calculateTotals]);

  const handleApplyCoupon = () => {
    if (!userInputCode.trim()) {
      toast.error("Please enter a code");
      return;
    }

    mutation.mutate(userInputCode.trim());
  };

  const handleRemoveCoupon = () => {
    removeCoupon();
    setUserInputCode("");
    setIsCouponApplied(false);
  };

  return (
    <div className="w-full lg:w-[40%] rounded-2xl border border-slate-300 p-4 shadow-md bg-white">
      <div className="space-y-4 text-center">
        <h2 className="text-base font-semibold text-gray-700">
          Do you have a voucher or gift card?
        </h2>

        <input
          type="text"
          id="voucher"
          className="w-full rounded-md border border-slate-300 p-2 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
          placeholder="Enter your code"
          value={userInputCode}
          onChange={(e) => setUserInputCode(e.target.value)}
        />

        <button
          type="button"
          disabled={mutation.isPending}
          className="w-full rounded-md bg-red-500 px-5 py-2 text-sm font-semibold text-white hover:bg-red-600 disabled:opacity-50"
          onClick={handleApplyCoupon}
        >
          {mutation.isPending ? "Applying..." : "Apply Code"}
        </button>
      </div>

      {isCouponApplied && coupon && (
        <div className="mt-6 space-y-2 text-center">
          <h3 className="text-base font-medium text-gray-800">
            Coupon Applied
          </h3>
          <p className="text-sm text-green-600">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
          <button
            type="button"
            className="w-full rounded-md bg-gray-200 px-5 py-2 text-sm font-medium text-gray-700 hover:bg-gray-300"
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </button>
        </div>
      )}

      {coupon && coupon.isActive && !isCouponApplied && (
        <div className="mt-6 space-y-2 text-center">
          <h3 className="text-base font-medium text-gray-800">
            Available Coupon
          </h3>
          <p className="text-sm text-blue-600">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </div>
  );
};

export default GiftCouponCard;
