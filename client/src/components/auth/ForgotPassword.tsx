import axios from "axios";
import React, { useState } from "react";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [submitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.SyntheticEvent<HTMLFormElement>) => {
    e.preventDefault();

    setIsSubmitting(true);
    try {
      await axios.post(
        `${import.meta.env.VITE_BASE_URL}/api/auth/forgot-password`,
        {
          email,
        }
      );
      toast.success("Email sent!");
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.log("error in forgot password", error);
      if (error.status == 429) {
        toast.error(error.response.data.error, { id: "forgotPassword" });
        setIsSubmitting(false);
        return;
      }

      toast.error(
        error.response.data.message || error.response.data.errors[0].msg,
        { id: "forgotPassword" }
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex">
      <div>
        <img
          src="../images/dl.beatsnoop 1.png"
          alt="image"
          className="w-[80%]  mt-[5%] h-full lg:h-[90%] hidden md:inline"
        />
      </div>

      <div className="mt-[15%]  flex mx-auto flex-col md:mr-[20%]  ">
        <h1 className="font-bold sm:text-xl whitespace-nowrap   pb-3">
          Forgot Password
        </h1>
        <p className="text-[12px] sm:text-sm">Enter your Email below</p>

        <div className="flex flex-col pt-6 ">
          <input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            type="email"
            required
            placeholder="Email"
            className=" border-b border-zinc-400 outline-none  w-[60%] sm:w-full"
          />
        </div>

        <div className="pt-6 flex items-center">
          <button
            type="submit"
            className="bg-red-500 whitespace-nowrap   mr-[3%] p-1 sm:p-2 text-zinc-200 rounded-md cursor-pointer hover:bg-red-600 w-full"
          >
            {submitting ? "Submitting..." : " Send"}
          </button>
        </div>
      </div>
    </form>
  );
}
