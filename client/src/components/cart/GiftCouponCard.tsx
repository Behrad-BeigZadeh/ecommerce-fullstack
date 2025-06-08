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
    <div className="flex flex-col border-2 border-slate-950 p-2">
      <div className="space-y-4">
        <div className="flex flex-col justify-center items-center">
          <label htmlFor="voucher" className="mb-2 block text-sm font-medium ">
            Do you have a voucher or gift card?
          </label>
          <input
            type="text"
            id="voucher"
            className="block  w-[75%] rounded-md border border-slate-950 text-md p-1.5"
            placeholder="Enter code here"
            value={userInputCode}
            onChange={(e) => setUserInputCode(e.target.value)}
            required
          />
        </div>

        <button
          type="button"
          disabled={mutation.isPending}
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-red-700 cursor-pointer"
          onClick={handleApplyCoupon}
        >
          {mutation.isPending ? "Applying..." : "Apply Code"}
        </button>
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">Applied Coupon</h3>

          <p className="mt-2 text-sm text-red-500">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>

          <button
            type="button"
            className="flex w-full items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-red-700 cursor-pointer"
            onClick={handleRemoveCoupon}
          >
            Remove Coupon
          </button>
        </div>
      )}

      {coupon && coupon.isActive && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-900">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-red-500">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </div>
  );
};

export default GiftCouponCard;
