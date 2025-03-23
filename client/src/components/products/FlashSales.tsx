import axios from "axios";
import { useEffect, useState } from "react";
import FlashSalesProduct from "./FlashSalesProduct";

export interface productType {
  _id: string;
  imageUrl: string;
  name: string;
  price: number;
  offPrice: number;
  stockQuantity: number;
  offPercent: number;
}

export default function FlashSales() {
  const [products, setProducts] = useState<[] | productType[]>([]);

  const getProducts = async () => {
    try {
      const result = await axios.get(
        `${import.meta.env.VITE_BASE_URL}/api/products`,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const products: productType[] = result.data.map(
        (item: productType) => item
      );
      setProducts(products);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getProducts();
  }, []);

  {
    return (
      <div className=" mx-auto gap-4 mt-5 grid grid-cols-1  sm:grid-cols-2 md:grid-cols-4">
        {products.map((item: productType) => {
          return (
            <div key={item._id}>
              <FlashSalesProduct product={item} />
            </div>
          );
        })}
      </div>
    );
  }
}
