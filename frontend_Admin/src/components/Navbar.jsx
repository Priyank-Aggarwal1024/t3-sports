import React, { useState, useEffect } from "react";
import { Link, NavLink } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { RiMenu5Fill } from "react-icons/ri";
import { CgClose } from "react-icons/cg";
import logo2 from "../assets/t3sports.png";
import logo from "../assets/t3sports_dark.png";
import axios from "axios";
import ThemeBtn from "../components/ThemeBtn";
import { BiSolidOffer } from "react-icons/bi";
import {
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure,
} from "../redux/user/userSlice";
import useTheme from "../contexts/theme";
import Loader from "./Loader";
import { LuHome } from "react-icons/lu";
import { MdOutlineExplore } from "react-icons/md";

const Navbar = () => {
  const { themeMode } = useTheme();
  const { currentUser } = useSelector((state) => state.user);
  const dispatch = useDispatch();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
    return () => {
      document.body.classList.remove("no-scroll");
    };
  }, [mobileMenuOpen]);
  const adminRoute =
    currentUser?.role == "admin"
      ? [
          { path: "/create", text: "Create", icon: <BiSolidOffer /> },
          { path: "/order", text: "Create Order", icon: <MdOutlineExplore /> },
          { path: "/ledger", text: "Ledger", icon: <MdOutlineExplore /> },
        ]
      : [];

  const navItems = [
    { path: "/", text: "Home", icon: <LuHome /> },
    ...adminRoute,
    {
      path: "/assigned-order",
      text: "Assigned Order",
      icon: <MdOutlineExplore />,
    },
    { path: "/all-orders", text: "All Orders", icon: <MdOutlineExplore /> },
    { path: "/analytics", text: "Analytics", icon: <MdOutlineExplore /> },
  ];
  const handleSignOut = async () => {
    try {
      setLoading(true);
      dispatch(signOutUserStart());
      const response = await axios.get(`/api/auth/signout`, {});
      const data = response.data;
      if (data.success === false) {
        dispatch(signOutUserFailure(data.message));
        return;
      }
      dispatch(signOutUserSuccess(data));
    } catch (error) {
      dispatch(signOutUserFailure(error.message));
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <Loader />;
  }

  return (
    <nav className="p-2 py-8 bg-white dark:bg-black dark:text-white border-b border-dullBlack border-t dark:border-[#949494] ">
      <div className="xs:px-6 flex justify-between items-center">
        {/* Hamburger menu for mobile */}
        <button
          className={`md:hidden text-2xl z-50 cursor-pointer hover:text-gray-400 transition-transform duration-300 ${
            mobileMenuOpen ? "transform rotate-180" : ""
          }`}
          onClick={toggleMobileMenu}
        >
          {mobileMenuOpen ? <CgClose /> : <RiMenu5Fill />}
        </button>

        {/* Logo */}
        <div className="flex justify-center md:justify-start">
          <Link to="/">
            <img
              src={themeMode === "dark" ? logo2 : logo}
              width={100}
              alt="logo"
            />
          </Link>
        </div>

        {/* Navigation items for desktop */}
        {currentUser && (
          <div className="hidden md:flex flex-grow flex-wrap justify-center gap-7">
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                className={({ isActive }) =>
                  isActive
                    ? "bg-black font-[Inter] text-white dark:text-black dark:bg-[#2F60F3] px-3 py-2 text-xs rounded-md"
                    : "bg-transparent border border-black dark:border-0 text-black dark:text-white dark:bg-black px-3 py-2 text-xs rounded-md"
                }
              >
                {item.text}
              </NavLink>
            ))}
          </div>
        )}

        <div className="relative md:ml-auto flex gap-2">
          <ThemeBtn />
          {currentUser ? (
            <div className="flex gap-2">
              <Link to={"/profile"}>
                <img
                  className="h-9 w-9 rounded-md object-cover"
                  src={currentUser.avatar}
                  alt="Profile"
                />
              </Link>

              <button
                onClick={handleSignOut}
                className="bg-black text-white dark:bg-[#2F60F3] text-xs hover:opacity-90 dark:text-black py-2 px-4 rounded-md"
              >
                Sign Out
              </button>
            </div>
          ) : (
            <Link
              to="/sign-in"
              className="bg-black text-white dark:bg-[#2F60F3] text-xs hover:opacity-90 dark:text-black py-2 px-4 rounded-md"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && currentUser && (
        <div className="md:hidden h-[80vh] dark:bg-black dark:text-white bg-black text-white my-6 py-4 px-4 w-full flex justify-between text-2xl items-left flex-col">
          <div>
            {navItems.map((item, index) => (
              <NavLink
                key={index}
                to={item.path}
                onClick={toggleMobileMenu}
                className={({ isActive }) =>
                  isActive
                    ? "active py-2 flex items-center gap-2"
                    : "py-2 flex items-center gap-2"
                }
              >
                {item.icon}
                {item.text}
              </NavLink>
            ))}
          </div>
          <div>
            <Link to="/">
              <img src={logo2} width={120} alt="logo" />
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
