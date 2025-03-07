import { FaStar } from "react-icons/fa";

export default function FlashSales() {
  return (
    <section className=" mx-auto gap-4 mt-5 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4">
      <div className="w-200  flex flex-col justify-center  max-w-[80%]   mx-auto">
        <div className="bg-zinc-200 w-full flex flex-col justify-center items-center rounded-t-xl p-5 ">
          <p className="bg-red-500  mr-[90%] -mt-[5%] font-semibold rounded-md p-1 text-zinc-300">
            -40%
          </p>
          <img
            src="../images/flashSales/pngimg.com - xbox_PNG17527.png"
            height={300}
            width={200}
            alt="image"
          />
        </div>
        <p className="w-full rounded-b-xl  text-center p-2 bg-black text-zinc-300 text-xl cursor-pointer hover:bg-zinc-800  font-semibold">
          Add To Cart
        </p>
        <div>
          <p className="font-semibold my-1.5">Xbox360-controller</p>
          <div className="flex ">
            <p className="text-red-500 font-medium">120$</p>
            <p className="text-zinc-500 line-through px-3 font-medium">160$</p>
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
    </section>
  );
}
