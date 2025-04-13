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
        <div className="w-[70%] sm:w-[80%] mt-10 mx-auto flex justify-center">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      );
    }
    if (isError) {
      toast.error(error?.message || "Failed to fetch cart items", {
        id: "fetchCart",
      });
      return (
        <div className="text-center text-red-500 font-semibold mt-4">
          Error loading items. Please try again.
        </div>
      );
    }
    return (
      <div>
        <h1 className="hidden ml-[10%] mx-auto mt-10 text-4xl font-bold text-zinc-900 border-b-4 border-red-500 sm:inline-block pb-2">
          Admin Page
        </h1>
        <div className=" hidden sm:grid grid-cols-5 grid-rows-1 mx-auto w-[80%]  text-center mt-10 border border-slate-100 font-bold p-3 shadow-md">
          <p className=" flex items-center justify-center">Product</p>
          <p className=" flex items-center justify-center">Price</p>
          <p className=" flex items-center justify-center">Stock</p>
          <p className=" flex items-center justify-center">Off</p>
          <p className=" flex items-center justify-center">Off Percent</p>
        </div>
        {data?.map((item: productType) => (
          <div key={item._id}>
            <Products product={item} />
          </div>
        ))}

        <a
          href="/add-product"
          className="bg-red-500 hover:bg-red-600 text-slate-200 flex justify-center items-center p-2 mx-auto mt-10 rounded-md cursor-pointer w-[20%]"
        >
          <button>Add Product</button>
        </a>
      </div>
    );
  }, [data, isLoading, isError, error]);
  return <>{content}</>;
};

export default AdminPanel;
