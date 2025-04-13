import { productType } from "../products/FlashSales";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Props {
  product: productType;
}
const Products = (props: Props) => {
  const product = props.product;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 1 }}
    >
      <div
        className="w-[70%] sm:w-[80%] mt-10 mx-auto hover:scale-105 transition duration-400"
        key={product._id}
      >
        <Link to={`/edit-product/${product._id}`}>
          <div className="hidden sm:grid grid-cols-5 grid-rows-1 border border-slate-100 font-semibold p-3 shadow-md text-[12px] lg:text-base">
            <div className="flex items-center gap-2">
              <img
                className="lg:w-20 lg:h-15 w-12 h-7"
                src={product.imageUrl}
                alt="image"
              />
              <p>{product.name}</p>
            </div>
            <p className="flex items-center justify-center">{product.price}$</p>
            <div className="flex items-center gap-2 justify-center">
              <p>{product.stockQuantity}</p>
            </div>
            {product.previousPrice && product.previousPrice > 0 && (
              <p className=" flex items-center justify-center line-through text-gray-500">
                {product.previousPrice}$
              </p>
            )}
            {product.offPercent && product.offPercent > 0 && (
              <p className="flex items-center justify-center">
                {product.offPercent}%
              </p>
            )}
          </div>

          {/* Mobile Responsive */}
          <div className="flex sm:hidden flex-col justify-center font-bold border border-slate-500 rounded-xl">
            <div className="bg-zinc-200 relative rounded-t-xl py-5 flex justify-center">
              <img className="h-20 w-20" src={product.imageUrl} alt="image" />
              {product.offPercent && product.offPercent > 0 && (
                <p className="absolute top-2 left-2 flex items-center justify-center rounded-sm w-10  bg-red-500  text-slate-900">
                  {product.offPercent}%
                </p>
              )}
            </div>

            <div>
              <p className="font-semibold my-1.5 ml-2">{product.name}</p>
              <div className="flex justify-between items-center mx-2">
                <div className="flex items-center gap-2">
                  <p>{product.price}$</p>
                  {product.previousPrice && product.previousPrice > 0 && (
                    <p className="line-through text-gray-500">
                      {product.previousPrice}$
                    </p>
                  )}
                </div>

                <div className="flex items-center p-3">
                  <p>{product.stockQuantity}</p>
                </div>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Products;
