import { useShopContext } from "@/contexts/Context";
import { loadStripe } from "@stripe/stripe-js";
import axios from "axios";
import { useCookies } from "react-cookie";

const stripePromise = loadStripe(
  String(import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY)
);
console.log(stripePromise);
const Order = () => {
  const { total, subtotal, coupon, isCouponApplied, cart } = useShopContext();

  const savings = subtotal - total;
  const formattedSubtotal = subtotal.toFixed(2);
  const formattedTotal = total.toFixed(2);
  const formattedSavings = savings.toFixed(2);
  const userID = window.localStorage.getItem("userID");
  const [cookies] = useCookies(["access_token"]);

  const handlePayment = async () => {
    const stripe = await stripePromise;
    const res = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/payments/create-checkout-session`,
      {
        products: cart,
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
    const result = await stripe.redirectToCheckout({
      sessionId: session.id,
    });

    if (result.error) {
      console.error("Error:", result.error);
    }
  };

  return (
    <div className="flex flex-col border-2 border-slate-950 p-2 ">
      <h1 className="font-bold text-xl mb-2">Cart Total</h1>
      <div className="flex items-center justify-between font-semibold  border-b border-slate-300 py-2">
        <p>Subtotal</p>
        <p>${formattedSubtotal}</p>
      </div>
      <div className="flex items-center justify-between font-semibold border-b border-slate-300 py-2">
        <p>Shipping</p>
        <p>free</p>
      </div>
      {savings > 0 && (
        <div className="flex items-center justify-between font-semibold py-2">
          <p>Savings</p>
          <p>-${formattedSavings}</p>
        </div>
      )}
      {coupon && isCouponApplied && (
        <div className="flex items-center justify-between font-semibold border-b border-slate-300 py-2">
          <p>Coupon ({coupon.code})</p>
          <p>-{coupon.discountPercentage}%</p>
        </div>
      )}
      <div className="flex items-center justify-between font-semibold py-2">
        <p>Total</p>
        <p>${formattedTotal}</p>
      </div>
      <button
        onClick={() => handlePayment()}
        className="bg-red-500 hover:bg-red-700 cursor-pointer text-slate-200 rounded-sm p-2 font-semibold mt-5 flex justify-center items-center"
      >
        Proceed To CheckOut
      </button>
    </div>
  );
};

export default Order;
