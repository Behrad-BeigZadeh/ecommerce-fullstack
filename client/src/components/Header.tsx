import { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { IoMenu } from "react-icons/io5";
import { BsCartCheckFill } from "react-icons/bs";
import { SlBasket } from "react-icons/sl";
import useCartStore from "@/stores/cartStore";
import { useCookies } from "react-cookie";
import useSearchStore from "@/stores/searchStore";
export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cartItems, userID, setUserID } = useCartStore();
  const [cookies, , removeCookie] = useCookies(["access_token"]);
  const { searchQuery, setSearchQuery } = useSearchStore();
  const logout = async () => {
    window.localStorage.removeItem("userID");
    setUserID("");
    removeCookie("access_token");
  };

  return (
    <div className="w-full h-full  ">
      <header className="flex justify-between items-center py-6 px-8 md:px-32 border border-zinc-300 ">
        <a href="/" className=" w-52 transition-all  font-bold text-2xl ">
          Exclusive
        </a>

        <section className="hidden xl:flex items-center gap-12 font-semibold text-base ">
          <a
            href="/"
            className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105"
          >
            Home
          </a>
          <a
            href="/contact"
            className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105"
          >
            Contact
          </a>
          <a
            href="/about"
            className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105"
          >
            About
          </a>
          {userID && cookies.access_token ? (
            <button
              onClick={logout}
              className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <a
              href="/signup"
              className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105"
            >
              SignUp
            </a>
          )}
        </section>
        <section className="relative hidden sm:flex items-center justify-center gap-3">
          <button className="absolute left-2 text-2xl">
            <CiSearch />
          </button>
          <input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            type="text"
            placeholder="Search..."
            className="py-1 pl-10 rounded-xl border-2 border-black"
          />
          <div className="flex">
            <a href="purchased-items">
              <BsCartCheckFill className="mx-2 text-2xl cursor-pointer" />
            </a>

            <a href="/cart-items" className="relative">
              <SlBasket className="text-2xl cursor-pointer" />
              {cartItems.length > 0 && userID && cookies.access_token ? (
                <p
                  className="absolute -top-2 left-2 bg-red-500 text-white rounded-full px-2 py-0.5 
									text-xs"
                >
                  {cartItems.length}
                </p>
              ) : (
                ""
              )}
            </a>
          </div>
        </section>
        <button
          className="xl:hidden block text-4xl sm:text-5xl  cursor-pointer"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
        >
          <IoMenu />
        </button>
        <div
          className={`absolute xl:hidden bg-zinc-900 text-zinc-300 top-24 left-0 w-full flex flex-col items-center gap-6 font-semibold text-lg transform transition-transform ${
            isMenuOpen ? "block z-10" : "hidden"
          }`}
        >
          <div className="w-[80%] mt-5">
            <input
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full py-2 px-4 rounded-xl border-2 border-zinc-600 text-zinc-400"
            />
          </div>
          <a
            href="/"
            className="w-full text-center p-4 transition-all  hover:text-zinc-600 hover:scale-105 "
          >
            Home
          </a>
          <a
            href="/contact"
            className="w-full text-center p-4 transition-all  hover:text-zinc-600 hover:scale-105 "
          >
            Contact
          </a>
          {userID && cookies.access_token ? (
            <button
              onClick={logout}
              className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105 cursor-pointer"
            >
              Logout
            </button>
          ) : (
            <a
              href="/signup"
              className="p-3 transition-all rounded-md hover:text-zinc-600 hover:scale-105"
            >
              SignUp
            </a>
          )}
          <a
            href="/about"
            className="w-full text-center p-4 transition-all  hover:text-zinc-600 hover:scale-105 "
          >
            About
          </a>

          <a
            href="/cart-items"
            className="w-full text-center p-4 transition-all  hover:text-zinc-600 hover:scale-105 "
          >
            Cart
          </a>
          <a
            href="/purchased-items"
            className="w-full text-center p-4 transition-all  hover:text-zinc-600 hover:scale-105 "
          >
            Purchased Items
          </a>
        </div>
      </header>
    </div>
  );
}
