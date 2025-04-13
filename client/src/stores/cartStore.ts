import { productType } from "@/components/products/FlashSales";
import toast from "react-hot-toast";
import { create, StateCreator } from "zustand";
import { persist, PersistOptions } from "zustand/middleware";

// Define CartStore type
interface CartStore {
  cartItems: productType[] | [];
  userID: string;
  coupon: CouponType | null;
  total: number;
  subtotal: number;
  isCouponApplied: boolean;
  setCartItems: (items: productType[]) => void;
  setUserID: (newUserID: string) => void;
  setCoupon: (newValue: CouponType) => void;
  removeCoupon: () => void;
  setIsCouponApplied: (newStatus: boolean) => void;
  addToCart: (product: productType) => void;
  updateCartQuantity: (productID: string, newQuantity: number) => void;
  removeCartItem: (productID: string) => void;
  calculateTotals: () => void;
}

export type CouponType = {
  code: string;
  discountPercentage: number;
  expirationDate: Date;
  isActive: boolean;
  userID: string;
};
// Define Persist Options
type CartPersist = (
  config: StateCreator<CartStore>,
  options: PersistOptions<CartStore>
) => StateCreator<CartStore>;

// Create Zustand store with persistence
export const useCartStore = create<CartStore>(
  (persist as CartPersist)(
    (set, get) => ({
      cartItems: [],
      userID: "",
      coupon: null,
      total: 0,
      subtotal: 0,
      isCouponApplied: false,
      setCartItems: (items: productType[]) => {
        set(() => ({ cartItems: [...items] }));
      },
      setUserID: (newUserID) => {
        set({ userID: newUserID });
      },
      setCoupon: (newValue) => {
        set({ coupon: newValue });
      },

      setIsCouponApplied: (newStatus: boolean) => {
        set({ isCouponApplied: newStatus });
      },
      addToCart: (product: productType) =>
        set((state) => {
          const existingItem = state.cartItems.find(
            (cartItem) => cartItem._id === product._id
          );
          if (existingItem) {
            return {
              cartItems: state.cartItems.map((cartItem) =>
                cartItem._id === product._id
                  ? { ...cartItem, quantity: cartItem.quantity + 1 }
                  : cartItem
              ),
            };
          } else {
            return {
              cartItems: [...state.cartItems, { ...product, quantity: 1 }],
            };
          }
        }),

      updateCartQuantity: (productID: string, newQuantity: number) =>
        set((state) => ({
          cartItems: state.cartItems.map((cartItem) =>
            cartItem._id === productID
              ? { ...cartItem, quantity: newQuantity }
              : cartItem
          ),
        })),
      removeCartItem: (productID: string) =>
        set((state) => ({
          cartItems: state.cartItems.filter(
            (cartItem) => cartItem._id !== productID
          ),
        })),
      calculateTotals: () => {
        const { cartItems, coupon, isCouponApplied } = get();
        const subtotal = cartItems.reduce(
          (sum, item) => sum + item.price * item.quantity,
          0
        );
        let total = subtotal;

        if (coupon && coupon.isActive && isCouponApplied) {
          const discount = subtotal * (coupon.discountPercentage / 100);
          total = subtotal - discount;
        }

        set({ subtotal, total });
      },
      removeCoupon: () => {
        set({ coupon: null, isCouponApplied: false });
        get().calculateTotals();
        toast.success("Coupon removed", { id: "removeCoupon" });
      },
    }),

    { name: "cart-storage" }
  )
);

export default useCartStore;
