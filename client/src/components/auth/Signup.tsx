import axios, { AxiosError } from "axios";
import { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";

interface ErrorResponse {
  message?: string;
  error?: string;
  errors?: { msg: string }[];
}

export default function Signup() {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });

  const navigate = useNavigate();

  const signupUser = async (userData: { email: string; password: string }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/signup`,
      userData
    );
    return data;
  };
  const mutation = useMutation({
    mutationFn: signupUser,
    onSuccess: (data) => {
      toast.success(data.message);
      navigate("/login");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 429) {
        toast.error(
          error.response?.data?.error ||
            "Too many requests, please try again later.",
          { id: "signup" }
        );
        return;
      }

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "An unknown error occurred.",
        { id: "signup" }
      );
    },
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      return toast.error("Passwords do not match", { id: "signup" });
    }
    const { confirmPassword, ...rest } = formData;
    mutation.mutate(rest);
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
          src="/images/dl.beatsnoop 1.png"
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
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            placeholder="Email"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
            placeholder="Password"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
          <input
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            type="password"
            required
            placeholder="Confirm Password"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
        </div>

        <div className="pt-6 flex items-center">
          <button
            disabled={mutation.isPending}
            type="submit"
            className="bg-red-500 whitespace-nowrap   mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {mutation.isPending ? "Submitting..." : " Sign Up"}
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
