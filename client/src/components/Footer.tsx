import { AiOutlineSend } from "react-icons/ai";
import QRCode from "react-qr-code";

export default function Footer() {
  return (
    <footer className=" bg-zinc-950 text-zinc-300 mt-15 w-fit min-w-full ">
      <div className="mx-auto py-14 px-6 container">
        <div className="grid md:grid-cols-12 grid-cols-1 gap-7">
          <div className="lg:col-span-2 md:col-span-4 col-span-12">
            <p className="mb-6 text-2xl">Exclusive</p>
            <p className="mb-6 text-[12px] sm:text-xl">Subscribe</p>
            <p className="mb-6 text-[10px] sm:text-sm">
              Get 10% off your first order
            </p>
            <div className="relative flex items-center">
              <input
                placeholder="Enter your email"
                type="text"
                className=" text-[12px]  bg-zinc-950 border-1 w-37 sm:w-40 border-zinc-300 flex sm:py-1  text-zinc-400 px-1"
              />
              <button className="absolute sm:text-xl ml-33">
                <AiOutlineSend />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 md:col-span-4 col-span-12">
            <p className=" mb-6 text-[12px] sm:text-xl ">Support</p>
            <p className=" mb-6 text-[10px] sm:text-sm">88015-8888-9999</p>
            <p className=" mb-6 text-[10px] sm:text-sm">exclusive@gmail.com</p>
          </div>
          <div className="lg:col-span-2 md:col-span-4 col-span-12">
            <p className=" mb-6 text-[12px] sm:text-xl">Account</p>
            <p className=" mb-6 text-[10px] sm:text-sm">My Account</p>
            <div className=" mb-6 text-[10px] sm:text-sm">
              <a href="/">Login /</a>
              <a href="/">Register</a>
            </div>
            <p className=" mb-6 text-[10px] sm:text-sm ">Cart</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Whishlist</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Shop</p>
          </div>

          <div className=" lg:col-span-2 md:col-span-4 col-span-12">
            <p className=" mb-6 text-[12px] sm:text-xl">Quick Link</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Privacy Policy</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Terms Of Use</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Shop</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Faq</p>
            <p className=" mb-6 text-[10px] sm:text-sm">Contact</p>
          </div>

          <div className=" lg:col-span-4 md:col-span-4 col-span-12">
            <p className=" mb-6 text-[12px] sm:text-xl ">Download App</p>
            <p className="text-sm mb-6 font-light text-[10px] sm:text-sm">
              save 3$ with App New User Only
            </p>
            <div className="flex flex-row flex-wrap items-center gap-4">
              <QRCode
                className="bg-white p-1 rounded"
                value="https://media.istockphoto.com/id/1347277582/vector/qr-code-sample-for-smartphone-scanning-on-white-background.jpg?s=612x612&w=0&k=20&c=6e6Xqb1Wne79bJsWpyyNuWfkrUgNhXR4_UYj3i_poc0="
                size={64}
              />
              <div className="flex flex-col gap-2">
                <img
                  className="w-[100px]"
                  src="https://joshbuchea.com/images/notes/app-store-badge-android-get-it-on-google-play.png"
                  alt="Google Play"
                />
                <img
                  className="w-[100px]"
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/3/3c/Download_on_the_App_Store_Badge.svg/2560px-Download_on_the_App_Store_Badge.svg.png"
                  alt="App Store"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
