import React, { useCallback, useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { ThemeProvider } from "./contexts/theme";
import Footer from "./components/Footer";
import { LoadScript } from "@react-google-maps/api";
import { Toaster } from "react-hot-toast";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "./redux/user/userSlice";
import { OrdersProvider } from "./contexts/OrdersContext.jsx";
import Loader from "./components/Loader.jsx";

axios.defaults.baseURL = import.meta.env.VITE_BASE_URL;
axios.defaults.withCredentials = true;
axios.defaults.headers.common["X-API-Key"] =
  import.meta.env.VITE_BACKEND_API_KEY;

const libraries = ["places"];

const App = () => {
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [themeMode, setThemeMode] = useState(
    localStorage.getItem("themeMode") || "light"
  );

  const darkTheme = useCallback(() => {
    setThemeMode("dark");
  }, []);

  const lightTheme = useCallback(() => {
    setThemeMode("light");
  }, []);

  useEffect(() => {
    const updateTheme = () => {
      document.documentElement.className = themeMode;
      localStorage.setItem("themeMode", themeMode);
    };

    updateTheme();
  }, [themeMode]);

  useEffect(() => {
    if (currentUser) {
      if (
        currentUser.role !== "Admin" &&
        currentUser.role !== "admin" &&
        currentUser.role !== "warehouse-admin"
      ) {
        handleSignOut();
      }
    } else {
      console.log("No current user found");
    }
  }, [currentUser]);

  const handleSignOut = async () => {
    try {
      dispatch(signOutUserStart());
      const response = await axios.get(`/api/auth/signout`);
      const data = response.data;
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    }
  };

  return (
    <LoadScript
      googleMapsApiKey={import.meta.env.VITE_GEOCODE_KEY}
      libraries={libraries}
    >
      <React.Suspense fallback={<Loader />}>
        <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
          <OrdersProvider>
            <Navbar />
            <Toaster position="top-right" />
            <Outlet />
            <Footer />
          </OrdersProvider>
        </ThemeProvider>
      </React.Suspense>
    </LoadScript>
  );
};

export default App;
