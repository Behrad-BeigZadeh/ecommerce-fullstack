import { useShopContext } from "@/contexts/Context";
import CartItemPage from "./CartItemPage";
import { LuPackageOpen } from "react-icons/lu";

const CartItems = () => {
  const { cart } = useShopContext();
  return (
    <>
      {cart.length !== 0 ? (
        <CartItemPage />
      ) : (
        <div className="flex flex-col justify-center items-center h-96 space-y-4">
          <div className="bg-base-100 rounded-full ">
            <LuPackageOpen className="size-20" />
          </div>
          <div className="text-center space-y-2">
            <h3 className="text-2xl font-semibold ">No products found</h3>
            <p className="text-gray-600 max-w-sm">
              Get started by adding your first product to the inventory
            </p>
          </div>
        </div>
      )}
    </>
  );
};

export default CartItems;
