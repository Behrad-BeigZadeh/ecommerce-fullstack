import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { getRegularProducts } from "../../api/api";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import useSearchStore from "@/stores/searchStore";
import { productType } from "./FlashSales";
import RegularProductsPage from "./RegularProductsPage";
import { TbRectangleVerticalFilled } from "react-icons/tb";

export default function RegularProducts() {
  const { searchQuery } = useSearchStore();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["regular-products"],
    queryFn: () => getRegularProducts(),
  });
  console.log(data);
  const filteredData = useMemo(() => {
    if (!data) return [];
    return data.filter((item: productType) =>
      item.name.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [data, searchQuery]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="w-[70%] sm:w-[80%] mt-10 mx-auto flex justify-center">
          <ClipLoader color="#4A90E2" size={50} />
        </div>
      );
    }

    if (isError) {
      toast.error(error?.message || "Failed to fetch items", {
        id: "fetchItems",
      });

      return (
        <div className="mx-auto mt-5">
          <p className="text-center text-red-500">
            There was an error fetching products.
          </p>
        </div>
      );
    }

    if (filteredData.length > 0) {
      return (
        <div>
          <div className="flex flex-col  justify-center ml-[5%] mt-15">
            <div className="flex  text-red-500 items-center mt-10  font-semibold">
              <TbRectangleVerticalFilled className="text-3xl" />
              <p className="text-2xl">Our Products</p>
            </div>
            <div className=" mt-7 flex ">
              <h1 className="font-bold text-[13px] sm:text-3xl mr-3">
                Explore Our Products
              </h1>
              <div className="flex justify-center -mt-3 "></div>
            </div>
          </div>
          <div className="mx-auto gap-4 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
            {filteredData.map((item: productType) => (
              <div key={item._id}>
                <RegularProductsPage product={item} />
              </div>
            ))}
          </div>
          ;
        </div>
      );
    }

    return (
      <div className="text-center mt-5">
        <p>No products match your search in regular items.</p>
      </div>
    );
  }, [filteredData, isLoading, isError, error]);

  return <>{content}</>;
}
