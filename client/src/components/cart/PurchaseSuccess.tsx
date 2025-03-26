import { useShopContext } from "@/contexts/Context";
import axios from "axios";
import { useEffect, useState } from "react";
import Confetti from "react-confetti";
import { useCookies } from "react-cookie";
import { FiCheckCircle } from "react-icons/fi";
import { RiArrowRightLine } from "react-icons/ri";
import { TbHeartHandshake } from "react-icons/tb";

const PurchaseSuccessPage = () => {
  const [isProcessing, setIsProcessing] = useState(true);
  const { clearCart } = useShopContext();
  const userID = window.localStorage.getItem("userID");
  const [cookies] = useCookies(["access_token"]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const handleCheckoutSuccess = async (sessionId) => {
      try {
        await axios.post(
          `${import.meta.env.VITE_BASE_URL}/api/payments/checkout-success`,
          {
            sessionId,
          },
          {
            headers: {
              Authorization: cookies.access_token,
              userID,
            },
          }
        );
        clearCart();
      } catch (error) {
        console.log(error);
      } finally {
        setIsProcessing(false);
      }
    };

    const sessionId = new URLSearchParams(window.location.search).get(
      "session_id"
    );
    if (sessionId) {
      handleCheckoutSuccess(sessionId);
    } else {
      setIsProcessing(false);
      setError("No session ID found in the URL");
    }
  }, [clearCart]);

  if (isProcessing) return "Processing...";

  if (error) return `Error: ${error}`;

  return (
    <div className="h-screen flex items-center justify-center px-4">
      <Confetti
        width={window.innerWidth}
        height={window.innerHeight}
        gravity={0.1}
        style={{ zIndex: 99 }}
        numberOfPieces={700}
        recycle={false}
      />

      <div className="max-w-md w-full bg-black rounded-lg shadow-xl overflow-hidden relative z-10">
        <div className="p-6 sm:p-8">
          <div className="flex justify-center">
            <FiCheckCircle className="text-slate-200 w-16 h-16 mb-4" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-slate-200 mb-2">
            Purchase Successful!
          </h1>

          <p className="text-gray-300 text-center mb-2">
            Thank you for your order. {"We're"} processing it now.
          </p>
          <p className="text-slate-200 text-center text-sm mb-6">
            Check your email for order details and updates.
          </p>
          <div className="bg-gray-700 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">Order number</span>
              <span className="text-sm font-semibold text-slate-200">
                #12345
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-400">Estimated delivery</span>
              <span className="text-sm font-semibold text-slate-200">
                3-5 business days
              </span>
            </div>
          </div>

          <div className="space-y-4">
            <button
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-2 px-4
             rounded-lg cursor-pointer flex items-center justify-center"
            >
              <TbHeartHandshake className="mr-2" size={18} />
              Thanks for trusting us!
            </button>
            <a
              href="/"
              className="w-full bg-gray-700 hover:bg-gray-600 text-slate-950 font-bold py-2 px-4 
            rounded-lg cursor-pointer flex items-center justify-center"
            >
              Continue Shopping
              <RiArrowRightLine className="ml-2" size={18} />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
export default PurchaseSuccessPage;
