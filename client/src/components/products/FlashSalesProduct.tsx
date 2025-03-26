import { productType } from "./FlashSales";
import { FaStar } from "react-icons/fa6";

import { useShopContext } from "@/contexts/Context";

interface Props {
  product: productType;
}

export default function FlashSalesProduct(props: Props) {
  const { addToCart } = useShopContext();
  const { offPercent, imageUrl, price, name, previousPrice } = props.product;
  const product = props.product;

  return (
    <div className="w-200  flex flex-col justify-center  max-w-[80%]   mx-auto">
      <div className="bg-zinc-200 w-full flex flex-col justify-center items-center rounded-t-xl p-5 ">
        <p className="bg-red-500  mr-[90%] -mt-[5%] font-semibold rounded-md p-1 text-zinc-300">
          -{offPercent}%
        </p>
        <img className="h-30" src={imageUrl} alt="image" />
      </div>

      <button
        onClick={() => addToCart(product)}
        className="w-full rounded-b-xl  text-center p-2 bg-black text-zinc-300 text-xl cursor-pointer hover:bg-zinc-800  font-semibold"
      >
        Add To Cart
      </button>
      <div className="text-red-500"></div>
      <div>
        <p className="font-semibold my-1.5">{name}</p>
        <div className="flex ">
          <p className="text-red-500 font-medium">{price}$</p>
          <p className="text-zinc-500 line-through px-3 font-medium">
            {previousPrice}$
          </p>
        </div>
      </div>
      <div className="text-amber-300 flex mt-1.5">
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
        <FaStar />
      </div>
    </div>
  );
}
