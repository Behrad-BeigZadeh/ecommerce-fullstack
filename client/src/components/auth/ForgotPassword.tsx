import React, { useState } from "react";
import toast from "react-hot-toast";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";

interface ErrorResponse {
  message: string;
}

export default function ForgotPassword() {
  const [email, setEmail] = useState<string>("");

  const forgotPasswordRequest = async (email: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
      { email }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: forgotPasswordRequest,

    onSuccess: () => {
      toast.success("Email sent!");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(error.message || "An error occurred", {
        id: "forgotPassword",
      });
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    mutation.mutate(email);
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div>
        <img
          src="../images/dl.beatsnoop 1.png"
          alt="image"
          className="w-[80%] mt-[5%] h-full lg:h-[90%] hidden md:inline"
        />
      </div>

      <div className="mt-[15%] flex mx-auto flex-col md:mr-[20%]">
        <h1 className="font-bold sm:text-xl whitespace-nowrap pb-3">
          Forgot Password
        </h1>
        <p className="text-[12px] sm:text-sm">Enter your Email below</p>

        <div className="flex flex-col pt-6">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email"
            className="border-b border-zinc-400 outline-none w-[60%] sm:w-full"
          />
        </div>

        <div className="pt-6 flex items-center">
          <button
            type="submit"
            className="bg-red-500 whitespace-nowrap mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {mutation.isPending ? "Submitting..." : "Send"}
          </button>
        </div>
      </div>
    </form>
  );
}
