import { useShopContext } from "@/contexts/Context";
import { useEffect, useState } from "react";
import { FaMinus, FaPlus } from "react-icons/fa6";
import { MdDelete } from "react-icons/md";
import { motion } from "framer-motion";

const CartItems = () => {
  const { getCartItems, cart, updateCartItem, removeCartItem } =
    useShopContext();
  const [quantity, setQuantity] = useState(0);

  useEffect(() => {
    getCartItems();
  }, []);
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1 }}
      className="flex flex-col items-center "
    >
      <div
        className=" hidden sm:grid grid-cols-4 grid-rows-1 mx-auto w-[65%] mr-[25%] text-center mt-10 border border-slate-100 font-bold p-3 
             shadow-md "
      >
        <p className=" flex items-center justify-center">Product</p>
        <p className=" flex items-center justify-center">Price</p>
        <p className=" flex items-center justify-center">Quantity</p>
        <p className=" flex items-center justify-center">Subtotal</p>
      </div>
      {cart.map((cartItem) => {
        return (
          <div className="w-[70%] sm:w-[80%] mt-10 mx-auto ">
            <div
              key={cartItem._id}
              className=" hidden sm:grid grid-cols-5 grid-rows-1   border border-slate-100 font-semibold p-3 
          shadow-md text-[12px] lg:text-base  "
            >
              <div className="flex items-center gap-5">
                <img
                  className="lg:w-20 lg:h-15 w-12 h-7  "
                  src={cartItem.imageUrl}
                  alt="image"
                />
                <p>{cartItem.name}</p>
              </div>
              <p className=" flex items-center justify-center">
                {cartItem.offPrice}
              </p>
              <div className="flex items-center gap-2 justify-center">
                <button
                  className="flex h-5 w-5  items-center justify-center rounded-md border
							 border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer"
                  onClick={() =>
                    cartItem.quantity === 1
                      ? removeCartItem(cartItem._id)
                      : updateCartItem(cartItem._id, cartItem.quantity - 1)
                  }
                >
                  <FaMinus className="text-gray-300" />
                </button>
                <p>{cartItem.quantity}</p>
                <button
                  className="flex h-5 w-5  items-center justify-center rounded-md border
							 border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer
						"
                  onClick={() =>
                    updateCartItem(cartItem._id, cartItem.quantity + 1)
                  }
                >
                  <FaPlus className="text-gray-300" />
                </button>
              </div>
              <p className=" flex items-center justify-center">
                {Math.floor(cartItem.quantity * cartItem.offPrice)}
              </p>
              <button
                onClick={() => removeCartItem(cartItem._id)}
                className="flex items-center justify-center text-red-600 text-xl hover:text-red-700 cursor-pointer"
              >
                <MdDelete />
              </button>
            </div>

            {/* MOBILE RESPONSIVE */}
            <div className=" flex sm:hidden flex-col  justify-center  font-bold border border-slate-500 rounded-xl  ">
              <div className="bg-zinc-200  rounded-t-xl py-5 flex justify-center  ">
                <img
                  className="h-20 w-20"
                  src={cartItem.imageUrl}
                  alt="image"
                />
              </div>

              <div>
                <p className="font-semibold my-1.5 ml-2">{cartItem.name}</p>
                <div className="flex justify-between items-center  ">
                  <p>{cartItem.offPrice}$</p>
                  <div className="flex  items-center p-3">
                    <button
                      className="flex h-5 w-5  items-center justify-center rounded-md border
							 border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer m-2"
                      onClick={() =>
                        cartItem.quantity === 1
                          ? removeCartItem(cartItem._id)
                          : updateCartItem(cartItem._id, cartItem.quantity - 1)
                      }
                    >
                      <FaMinus className="text-gray-300" />
                    </button>
                    <p>{cartItem.quantity}</p>
                    <button
                      className="flex h-5 w-5  items-center justify-center rounded-md border
							 border-slate-900 bg-slate-950 hover:bg-slate-700 cursor-pointer m-2
						"
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

      <div className=" mt-10 hidden sm:flex items-center">
        <button className=" w-[147px] whitespace-nowrap border border-slate-400 p-2 rounded-md font-semibold letter tracking-wide hover:bg-slate-200 ml-[10%]">
          <a href="/">Return To Shop</a>
        </button>
      </div>
    </motion.div>
  );
};

export default CartItems;
