import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import toast from "react-hot-toast";


function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false); // State for loading indicator
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Set loading state to true while waiting for response
    try {
      const response = await axios.post(
        `/api/auth/forgot-password`,
        {
          email: email,
        },
        {

        }
      );
      if (response.data.Status === "Success") {
        navigate(`/reset-password?email=${email}`);
      }
    } catch (error) {
      toast.error(error?.message);
    } finally {
      setLoading(false); // Reset loading state after response is received
    }
  };

  return (
    <div
      className="min-h-screen bg-white text-black dark:bg-black dark:text-white flex items-center justify-center"
    >
      <div
        className={`bg-dullBlack z-10 shadow-md rounded-xl px-8 pt-6 pb-8 mb-4 max-w-md w-5/6`}
      >
        <h1 className="text-3xl font-semibold text-center mb-6 text-white dark:text-[#2F60F3] ">
          Forgot Password
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="mb-4">
            <label htmlFor="email" className="sr-only">
              <strong>Email</strong>
            </label>
            <input
              type="email"
              placeholder="Enter Email"
              name="email"
              value={email}
              required
              className="w-full border border-gray-500 placeholder:text-xs md:placeholder:text-sm rounded-xl py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-[#2F60F3] focus:border-white"
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className={`w-full bg-white dark:bg-[#2F60F3] text-black dark:text-black py-3 rounded-xl uppercase hover:opacity-95 disabled:opacity-80 ${loading ? "opacity-80 cursor-not-allowed" : ""
              }`}
            disabled={loading} // Disable button while loading
          >
            {loading ? "Loading..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
