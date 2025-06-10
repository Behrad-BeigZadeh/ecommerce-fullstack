import { useQuery } from "@tanstack/react-query";
import { productType } from "../products/FlashSales";
import Products from "./Products";
import { getAllProducts } from "@/api/adminApi";
import useCartStore from "@/stores/cartStore";
import { useCookies } from "react-cookie";
import { useMemo } from "react";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";

const AdminPanel = () => {
  const { userID } = useCartStore();
  const [cookies] = useCookies(["access_token"]);

  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["All-products"],
    queryFn: () => getAllProducts(cookies.access_token, userID),
  });

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-full flex justify-center mt-10">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      );
    }

    if (isError) {
      toast.error(error?.message || "Failed to fetch products", {
        id: "fetchCart",
      });
      return (
        <div className="text-center text-red-500 font-semibold mt-4">
          Error loading items. Please try again.
        </div>
      );
    }

    return (
      <div className="w-full flex flex-col items-center px-2">
        <h1 className="hidden sm:inline-block mt-10 text-4xl font-bold text-zinc-900 border-b-4 border-red-500 pb-2">
          Admin Page
        </h1>

        <div className="hidden sm:grid grid-cols-5 mt-10 w-[80%] text-center border border-slate-100 font-bold p-3 shadow-md">
          <p className="flex items-center justify-center">Product</p>
          <p className="flex items-center justify-center">Price</p>
          <p className="flex items-center justify-center">Stock</p>
          <p className="flex items-center justify-center">Off</p>
          <p className="flex items-center justify-center">Off Percent</p>
        </div>

        <div className="w-full flex flex-col items-center">
          {data?.map((item: productType) => (
            <Products key={item._id} product={item} />
          ))}
        </div>

        <a
          href="/add-product"
          className="w-[90%] sm:w-[20%] max-w-[400px] bg-red-500 hover:bg-red-600 text-slate-200 flex justify-center items-center p-2 mt-10 rounded-md cursor-pointer"
        >
          <button>Add Product</button>
        </a>
      </div>
    );
  }, [data, isLoading, isError, error]);

  return <>{content}</>;
};

export default AdminPanel;
