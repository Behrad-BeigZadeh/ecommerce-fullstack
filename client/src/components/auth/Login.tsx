import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";

interface errorType {
  msg: string;
}

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const [errors, setErrors] = useState<errorType[]>([]);
  const [_, setCookies] = useCookies(["access_token"]);
  const navigate = useNavigate();

  const loginUser = async (userData: { email: string; password: string }) => {
    const { data } = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
        {
          email,
          password,
        }
      );

      setCookies("access_token", res.data.token);
      window.localStorage.setItem("userID", res.data.userID);
      toast.success(res?.data.message);
      navigate("/");
    } catch (error) {
      setIsSubmitting(false);
      console.log("error in login", error);
      if (error.status == 429) {
        toast.error(error.response.data.error, { id: "login" });
        setIsSubmitting(false);
        return;
      }
      console.log(error.response.data.errors);

      toast.error(
        error.response.data.message || error.response.data.errors[0].msg,
        { id: "login" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.form
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      onSubmit={handleSubmit}
      className="flex"
    >
      <div>
        <img
          src="../images/dl.beatsnoop 1.png"
          alt="image"
          className="w-[80%]  mt-[5%] h-full lg:h-[90%] hidden md:inline"
        />
      </div>

      <div className="mt-[15%]  flex mx-auto flex-col md:mr-[20%]  ">
        <h1 className="font-bold sm:text-xl whitespace-nowrap   pb-3">
          Login to Exclusive
        </h1>
        <p className="text-[12px] sm:text-sm">Enter your details below</p>

        <div className="flex flex-col pt-6 ">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Password"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
        </div>
        {errors.length > 0 && (
          <div className=" text-center  text-red-600 rounded-md p-4 mb-4 animate-pulse">
            {errors.map((error, index) => (
              <p key={index} className="text-sm">
                {error.msg}
              </p>
            ))}
          </div>
        )}
        <div className="pt-6 flex items-center">
          <button
            type="submit"
            className="bg-red-500 whitespace-nowrap   mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {submitting ? "Submitting..." : " Login"}
          </button>
          <a
            href="/forgot-password"
            className="text-red-500 whitespace-nowrap cursor-pointer hover:text-red-600 hover:underline text-[12px] sm:text-[15px] font-semibold"
          >
            Forgot Password ?
          </a>
        </div>
        <p className=" whitespace-nowrap text-center mt-4 text-[12px] sm:text-[15px] ">
          Don't have an account ?
          <a
            href="/signup"
            className="text-red-500 hover:text-red-600 underline ml-1 font-semibold"
          >
            Signup
          </a>
        </p>
      </div>
    </motion.form>
  );
}
