import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { RiEyeFill, RiEyeOffFill } from "react-icons/ri"; // Import icons from React Icons
import axios from "axios";
import toast from "react-hot-toast";

import {
  signInStart,
  signInFailure,
  signInSuccess,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";

export default function SignIn() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  // useEffect(() => {
  //   dispatch(signInFailure(null));
  // }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const userResponse = await axios.get(
        `/api/user/get-user/${formData.email}`
      );
      const userData = userResponse.data;

      if (userData.role !== "admin" && userData?.role !== "warehouse-admin") {
        toast.error("You are not an admin. Please go to the user portal.");
        return;
      }
    } catch (error) {
      toast.error(error?.message);
    }

    try {
      dispatch(signInStart());

      const response = await axios.post(`/api/auth/signin`, formData, {
        headers: {
          'x-api-key': '12345678-abcd-90ef-ghij-klmnopqrstuv'
        }
      });

      if (response.data.success === false) {
        dispatch(signInFailure(response.data.message));
        toast.error(response.data.message);
        return;
      }

      dispatch(signInSuccess(response.data));
      toast.success("Sign in successful");
      navigate("/");
    } catch (error) {
      dispatch(signInFailure(error.message));
      toast.error("Sign in failed: " + error.message);
    }
  };


  return (
    <>
      <div className="flex relative items-start justify-center h-[100vh] bg-white dark:bg-darkPrimary dark:text-white w-full">
        <div className="hidden absolute lg:block w-full h-full bg-cover">
          <img
            className="w-full object-cover h-full brightness-50"
            src="https://assets.lummi.ai/assets/QmQBWfGja4sSm5siaE1K3M89BhPPYcaiBKsGR1S26vV8QP?auto=format&w=1500"
            alt=""
          />
        </div>
        <div
          className={`lg:w-1/2 w-full max-w-[600px] lg:mx-0 mx-auto glassDark dark:glass lg:absolute lg:left-0 h-full flex flex-col justify-center rounded-xl p-8`}
        >
          <h1 className="text-3xl font-semibold text-center mb-12 text-black dark:text-white">
            Login to your Account
          </h1>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div className="">
              <label htmlFor="email" className="sr-only">
                Email
              </label>
              <input
                type="email"
                placeholder="name@example.com"
                className="w-full border text-xs rounded-xl py-3 px-4 text-black dark:text-white bg-transparent focus:outline-none dark:focus:border-[#2F60F3] focus:border-black"
                id="email"
                required
                onChange={handleChange}
              />
            </div>
            <div className=" relative">
              <label htmlFor="password" className="sr-only text-black">
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="w-full text-black dark:text-white border bg-transparent rounded-xl py-3 px-4 focus:outline-none text-xs dark:focus:border-[#2F60F3] focus:border-black pr-12"
                id="password"
                required
                onChange={handleChange}
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                className="absolute inset-y-0 right-0 px-3 py-2 text-black dark:text-[#2F60F3] focus:outline-none"
              >
                {showPassword ? (
                  <RiEyeOffFill size={24} />
                ) : (
                  <RiEyeFill size={24} />
                )}{" "}
                {/* Use React Icons */}
              </button>
            </div>
            <Link
              className="text-xs text-right text-black dark:text-white block underline underline-offset-4"
              to="/forgot-password"
            >
              Forgot Password
            </Link>
            <button
              disabled={loading}
              className="w-full bg-black dark:bg-[#2F60F3] text-white dark:text-black py-3 rounded-xl uppercase hover:opacity-95 disabled:opacity-80 text-xs"
            >
              {loading ? "Loading..." : "Sign In"}
            </button>
            <div className="mt-4 flex items-center justify-between">
              <span className="border-b w-1/5 border-black/20 dark:border-[#2F60F3] lg:w-1/4"></span>
              <Link
                to={"/sign-in"}
                className="text-xs text-center text-gray-500 uppercase"
              >
                OR
              </Link>

              <span className="border-b w-1/5 border-black/20 dark:border-[#2F60F3] lg:w-1/4"></span>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <Link
                to={"/sign-up"}
                className="text-xs text-center text-black dark:text-white underline underline-offset-4 uppercase"
              >
                Register
              </Link>
            </div>
          </form>
          {error && (
            <p className="text-red-500 mt-5 text-xs text-center">{error}</p>
          )}
        </div>
      </div>
    </>
  );
}
