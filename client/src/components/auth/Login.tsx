import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios, { AxiosError } from "axios";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { useMutation } from "@tanstack/react-query";
import { useAdminStore } from "@/stores/adminStore";

interface ErrorResponse {
  message: string;
}

export default function Login() {
  const { setUserRole } = useAdminStore();
  const [, setCookies] = useCookies(["access_token"]);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const loginUser = async (userData: { email: string; password: string }) => {
    const { data } = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/login`,
      userData
    );
    return data;
  };

  const mutation = useMutation({
    mutationFn: loginUser,
    onSuccess: (data) => {
      setCookies("access_token", data.token);
      window.localStorage.setItem("userID", data.userID);
      setUserRole(data.userRole);
      toast.success(data.message);
      navigate("/");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response) {
        toast.error(error.response.data.message || "Login failed", {
          id: "login",
        });
      } else {
        toast.error("An error occurred. Please try again.", {
          id: "login",
        });
      }
    },
  });

  const handleChange = ({
    target: { name, value },
  }: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!formData.email || !formData.password) {
      return toast.error("Please fill in all fields", { id: "login" });
    }
    mutation.mutate(formData);
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
          className="w-[80%] mt-[5%] h-full lg:h-[90%] hidden md:inline"
        />
      </div>

      <div className="mt-[15%] flex mx-auto flex-col md:mr-[20%]">
        <h1 className="font-bold sm:text-xl whitespace-nowrap pb-3">
          Login to Your Account
        </h1>
        <p className="text-[12px] sm:text-sm">Enter your credentials below</p>

        <div className="flex flex-col pt-6">
          <input
            name="email"
            value={formData.email}
            onChange={handleChange}
            type="email"
            required
            placeholder="Email"
            className="border-b border-zinc-400 outline-none w-[60%] sm:w-full"
          />
          <input
            name="password"
            value={formData.password}
            onChange={handleChange}
            type="password"
            required
            placeholder="Password"
            className="border-b border-zinc-400 outline-none w-[60%] sm:w-full"
          />
        </div>
        <div></div>
        <div className="pt-6 flex items-center">
          <button
            disabled={mutation.isPending}
            type="submit"
            className="bg-red-500 whitespace-nowrap mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {mutation.isPending ? "Logging in..." : "Log In"}
          </button>{" "}
          <a
            href="/forgot-password"
            className="text-red-500 whitespace-nowrap cursor-pointer hover:text-red-600 hover:underline text-[12px] sm:text-[15px] font-semibold"
          >
            Forgot Password ?
          </a>
        </div>
        <p className="whitespace-nowrap text-center mt-4 text-[12px] sm:text-[15px]">
          Don't have an account?
          <a
            href="/signup"
            className="text-red-500 hover:text-red-600 underline ml-1 font-semibold"
          >
            Sign Up
          </a>
        </p>
      </div>
    </motion.form>
  );
}
