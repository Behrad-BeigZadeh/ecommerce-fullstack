import { useMemo } from "react";
import FlashSalesProduct from "./FlashSalesProduct";
import { useQuery } from "@tanstack/react-query";
import { getFlashSaleProducts } from "../../api/api";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import useSearchStore from "@/stores/searchStore";

export interface productType {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  previousPrice?: number | null;
  quantity: number;
  offPercent?: number | null;
  stockQuantity: number;
}

export default function FlashSales() {
  const { searchQuery } = useSearchStore();
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ["flash-sales"],
    queryFn: () => getFlashSaleProducts(),
  });

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
        <div className="mx-auto gap-4 mt-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4">
          {filteredData.map((item: productType) => (
            <div key={item._id}>
              <FlashSalesProduct product={item} />
            </div>
          ))}
        </div>
      );
    }

    return (
      <div className="text-center mt-5">
        <p>No products match your search in flash sales.</p>
      </div>
    );
  }, [filteredData, isLoading, isError, error]);

  return <>{content}</>;
}
