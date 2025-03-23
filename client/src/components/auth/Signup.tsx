import axios from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    if (password !== confirmPassword) {
      setIsSubmitting(false);
      return toast.error("Passwords do not match", { id: "signup" });
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
        {
          email,
          password,
        }
      );

      toast.success(res?.data.message);
      navigate("/login");
    } catch (error) {
      setIsSubmitting(false);
      console.log("error in signup", error);
      if (error.status == 429) {
        toast.error(error.response.data.error, { id: "signup" });
        setIsSubmitting(false);
        return;
      }

      toast.error(
        error.response.data.message || error.response.data.errors[0].msg,
        { id: "signup" }
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
          Sign Up to Exclusive
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
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            placeholder="Confirm Password"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
        </div>

        <div className="pt-6 flex items-center">
          <button
            type="submit"
            className="bg-red-500 whitespace-nowrap   mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {submitting ? "Submitting..." : " Sign Up"}
          </button>
        </div>
        <p className=" whitespace-nowrap text-center mt-4 text-[12px] sm:text-[15px] ">
          Already a member ?
          <a
            href="/login"
            className="text-red-500 hover:text-red-600 underline ml-1 font-semibold"
          >
            Login
          </a>
        </p>
      </div>
    </motion.form>
  );
}
