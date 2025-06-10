import { productType } from "../products/FlashSales";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

interface Props {
  product: productType;
}

const Products = ({ product }: Props) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, delay: 0.3 }}
      className="flex justify-center w-full"
    >
      <div className="w-[90%] sm:w-[80%]  mt-8 mx-auto transition-transform hover:scale-[1.03]">
        <Link to={`/edit-product/${product._id}`}>
          {/* Desktop layout */}
          <div className=" hidden sm:grid grid-cols-5 border border-slate-100 font-semibold p-3 shadow-md text-sm lg:text-base">
            <div className="flex items-center gap-2">
              <img
                className="lg:w-20 lg:h-20 object-contain w-12 h-7"
                src={product.imageUrl}
                alt="image"
              />
              <p>{product.name}</p>
            </div>
            <p className="flex items-center justify-center mx-1">
              {product.price}$
            </p>
            <div className="flex items-center justify-center">
              <p>{product.stockQuantity}</p>
            </div>
            {product.previousPrice && product.previousPrice > 0 ? (
              <p className="flex items-center justify-center line-through text-gray-500">
                {product.previousPrice}$
              </p>
            ) : (
              <div />
            )}
            {product.offPercent && product.offPercent > 0 ? (
              <p className="flex items-center justify-center">
                {product.offPercent}%
              </p>
            ) : (
              <div />
            )}
          </div>

          {/* Mobile layout */}
          <div className="sm:hidden w-[70%]  mx-auto my-4 rounded-xl border border-slate-300 shadow-md overflow-hidden">
            <div className="relative bg-zinc-100 py-4 flex justify-center items-center">
              <img
                className="h-24 w-24 object-contain"
                src={product.imageUrl}
                alt="product image"
              />
              {product.offPercent && product.offPercent > 0 && (
                <p className="absolute top-2 left-2 text-xs px-2 py-0.5 bg-red-500 text-white rounded">
                  {product.offPercent}%
                </p>
              )}
            </div>

            <div className="p-4 text-sm text-gray-700 space-y-2">
              <p className="font-semibold text-base text-gray-900 truncate">
                {product.name}
              </p>

              <div className="flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <p className="font-semibold text-green-600">
                    ${product.price}
                  </p>
                  {product.previousPrice && product.previousPrice > 0 && (
                    <p className="line-through text-gray-400 text-xs">
                      ${product.previousPrice}
                    </p>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  Stock: {product.stockQuantity}
                </p>
              </div>
            </div>
          </div>
        </Link>
      </div>
    </motion.div>
  );
};

export default Products;
