import { useShopContext } from "@/contexts/Context";
import { useEffect, useState } from "react";

const GiftCouponCard = () => {
  const [userInputCode, setUserInputCode] = useState("");
  const { coupon, isCouponApplied, getCoupon, applyCoupon, removeCoupon } =
    useShopContext();

  useEffect(() => {
    getCoupon();
  }, [getCoupon]);

  useEffect(() => {
    if (coupon) setUserInputCode(coupon.code);
  }, [coupon]);

  const handleApplyCoupon = () => {
    if (!userInputCode) return;
    applyCoupon(userInputCode);
  };

  const handleRemoveCoupon = async () => {
    await removeCoupon();
    setUserInputCode("");
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
          className="flex w-full items-center justify-center rounded-lg bg-red-500 px-5 py-2.5 text-sm font-medium text-slate-200 hover:bg-red-700 cursor-pointer"
          onClick={handleApplyCoupon}
        >
          Apply Code
        </button>
      </div>
      {isCouponApplied && coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">Applied Coupon</h3>

          <p className="mt-2 text-sm text-gray-400">
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

      {coupon && (
        <div className="mt-4">
          <h3 className="text-lg font-medium text-gray-300">
            Your Available Coupon:
          </h3>
          <p className="mt-2 text-sm text-gray-400">
            {coupon.code} - {coupon.discountPercentage}% off
          </p>
        </div>
      )}
    </div>
  );
};

export default GiftCouponCard;
