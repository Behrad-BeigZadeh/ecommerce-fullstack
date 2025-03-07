import { AiOutlineSend } from "react-icons/ai";
import QRCode from "react-qr-code";

export default function Footer() {
  return (
    <footer className="  bg-zinc-950 text-zinc-300 mt-15 ">
      <div className="mx-auto py-14 px-6 container">
        <div className="grid md:grid-cols-12 grid-cols-1 gap-7">
          <div className="lg:col-span-2 md:col-span-4 col-span-12">
            <p className="mb-6">Exclusive</p>
            <p className="mb-6">Subscribe</p>
            <p className="mb-6">Get 10% off your first order</p>
            <div className="relative flex items-center">
              <input
                placeholder="Enter your email"
                type="text"
                className=" bg-zinc-950 border-1 border-zinc-300 flex py-1 pl-3 text-zinc-400"
              />
              <button className="absolute text-xl ml-35">
                <AiOutlineSend />
              </button>
            </div>
          </div>

          <div className="lg:col-span-2 md:col-span-4 col-span-12">
            <p className=" mb-6 ">Support</p>
            <p className=" mb-6 ">88015-8888-9999</p>
            <p className=" mb-6 ">exclusive@gmail.com</p>
          </div>
          <div className="lg:col-span-2 md:col-span-4 col-span-12">
            <p className=" mb-6 ">Account</p>
            <p className=" mb-6 ">My Account</p>
            <div className=" mb-6 ">
              <a href="/">Login /</a>
              <a href="/">Register</a>
            </div>
            <p className=" mb-6 ">Cart</p>
            <p className=" mb-6 ">Whishlist</p>
            <p className=" mb-6 ">Shop</p>
          </div>

          <div className=" lg:col-span-2 md:col-span-4 col-span-12">
            <p className=" mb-6 ">Quick Link</p>
            <p className=" mb-6 ">Privacy Policy</p>
            <p className=" mb-6 ">Terms Of Use</p>
            <p className=" mb-6 ">Shop</p>
            <p className=" mb-6 ">Faq</p>
            <p className=" mb-6 ">Contact</p>
          </div>

          <div className=" lg:col-span-4 md:col-span-4 col-span-12">
            <p className=" mb-6 ">Download App</p>
            <p className="text-sm mb-6 font-light">
              save 3$ with App New User Only
            </p>
            <div className="flex ">
              <QRCode
                className="w-20 p-0.5  h-18 bg-zinc-200 "
                value="https://media.istockphoto.com/id/1347277582/vector/qr-code-sample-for-smartphone-scanning-on-white-background.jpg?s=612x612&w=0&k=20&c=6e6Xqb1Wne79bJsWpyyNuWfkrUgNhXR4_UYj3i_poc0="
              />
              <div>
                <img
                  className="w-30"
                  src="../images/Google_Play_Store_badge_FR.svg.png"
                  alt="image"
                />
                <img
                  className="w-30"
                  src="../images/Download_on_the_App_Store_Badge.svg.png"
                  alt="image"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
