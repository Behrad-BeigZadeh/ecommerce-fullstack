import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";

interface ErrorResponse {
  errors: { msg: string }[];
  message: string;
  error: string;
}

export default function ResetPassword() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [resetToken, setResetToken] = useState("");

  const navigate = useNavigate();

  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const token = params.get("token");
    if (token) {
      setResetToken(token);
    } else {
      alert("not authorized");
    }
  }, [location.search]);

  const resetPasswordRequest = async (newPassword: string) => {
    const response = await axios.post(
      `${import.meta.env.VITE_BASE_URL}/api/auth/reset-password`,
      {
        token: resetToken,
        newPassword: newPassword,
      }
    );
    return response.data;
  };

  const mutation = useMutation({
    mutationFn: resetPasswordRequest,
    onSuccess: () => {
      toast.success("Password reset successfully!");
      navigate("/login");
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      if (error.response?.status === 429) {
        toast.error(
          error.response?.data?.error ||
            "Too many requests, please try again later.",
          { id: "resetPassword" }
        );
        return;
      }

      toast.error(
        error.response?.data?.message ||
          error.response?.data?.errors?.[0]?.msg ||
          "An unknown error occurred.",
        { id: "resetPassword" }
      );
    },
  });

  const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match", { id: "resetPassword" });
    }
    mutation.mutate(password);
  };

  return (
    <form onSubmit={handleSubmit} className="flex ml-5">
      <div>
        <img
          src="../images/dl.beatsnoop 1.png"
          alt="image"
          className="w-[80%]  mt-[5%] h-full lg:h-[90%] hidden md:inline"
        />
      </div>

      <div className="mt-[15%]  flex mx-auto flex-col md:mr-[20%]  ">
        <h1 className="font-bold sm:text-xl whitespace-nowrap   pb-3">
          Reset Password
        </h1>
        <p className="text-[12px] sm:text-sm">Enter your new password below</p>

        <div className="flex flex-col pt-6 ">
          <input
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            type="password"
            required
            placeholder="Password"
            className=" border-b border-zinc-400  text-[12px] sm:text-sm outline-none  w-[60%] sm:w-full"
          />
          <input
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            type="password"
            required
            placeholder="Confirm password"
            className=" border-b border-zinc-400 outline-none text-[12px] sm:text-sm  w-[60%] sm:w-full"
          />
        </div>

        <div className="pt-6 flex items-center">
          <button
            type="submit"
            className="bg-red-500 whitespace-nowrap   mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {mutation.isPending ? "Submitting..." : " Submit"}
          </button>
        </div>
      </div>
    </form>
  );
}
