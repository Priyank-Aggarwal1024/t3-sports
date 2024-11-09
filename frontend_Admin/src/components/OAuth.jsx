import React from "react";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { signInSuccess } from "../redux/user/userSlice.js";
import axios from "axios";
import { GoogleLogin, GoogleOAuthProvider } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import toast from "react-hot-toast";

const clientId = import.meta.env.VITE_GOOGLE_AUTH_KEY;


const OAuth = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleGoogleClick = async (googleResponse) => {
    try {
      const result = jwtDecode(googleResponse.credential);

      try {
        const userResponse = await axios.get(
          `/api/user/get-user/${result.email}`
        );
        const userData = userResponse.data;

        if (userData.role !== "Admin") {
          toast.error("You are not an admin. Please go to the user portal.");
          return;
        }
      } catch (error) {
        console.log(error);
      }

      const response = await axios.post(
        `/api/auth/google`,
        {
          name: result.name,
          email: result.email,
          photo: result.picture,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      const data = response.data;
      dispatch(signInSuccess(data));
      navigate("/");
    } catch (error) {
      console.log("Could not sign in with Google", error);
    }
  };

  const onFailure = (response) => {
    toast.error("Login failed. Please try again.");
    console.log("Login failed: response:", response);
  };

  return (
    <div className="flex justify-center items-center">
      <GoogleOAuthProvider clientId={clientId}>
        <GoogleLogin onSuccess={handleGoogleClick} onError={onFailure} />
      </GoogleOAuthProvider>
    </div>
  );
};

export default OAuth;
