import React from "react";
import logo2 from "../assets/t3sports.png";
import logo from "../assets/t3sports_dark.png";
import useTheme from "../contexts/theme";

const Loader = () => {
  const { themeMode } = useTheme();
  return (
    <>
      <div className="flex justify-center md:justify-start fixed top-10 z-[51] translate-x-[-50%] left-[50%]">
        <p className="flex gap-2 flex-col items-center w-[120px]">
          <img
            src={themeMode === "dark" ? logo2 : logo}
            width={100}
            alt="logo"
          />
        </p>
      </div>
      <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center bg-white dark:bg-darkPrimary z-50">
        <div className="relative flex items-center justify-center">
          <div className="absolute w-32 h-32 border-4 border-t-[#2F60F3] border-r-secondary border-b-[#2F60F3] border-l-secondary rounded-xl animate-spin"></div>
          <div className="absolute w-24 h-24 border-4 border-t-secondary border-r-[#2F60F3] border-b-secondary border-l-[#2F60F3] rounded-xl animate-spin-reverse"></div>
        </div>
      </div>
    </>
  );
};

export default Loader;
