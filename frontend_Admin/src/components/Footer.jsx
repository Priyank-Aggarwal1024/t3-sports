import React from "react";
import { FaArrowCircleUp, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <footer
      className={`xl:px-24 p-8 bg-neutral-100 dark:bg-darkPrimary dark:text-white w-full`}
    >
      <div className="flex justify-between text-left">
        <div>
          <h4 className="text-xl lg:text-3xl font-semibold">Reach us here!</h4>

          <div className={"mt-4 lg:mb-0  flex space-x-4"}>
            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaInstagram
                className={`hover:text-[#2F60F3] transition duration-300`}
              />
            </a>

            <a href="#" target="_blank" rel="noopener noreferrer">
              <FaLinkedin
                className={`hover:text-[#2F60F3] transition duration-300`}
              />
            </a>
          </div>
        </div>

        <div>
          <ul className="list-unstyled  gap-4 flex justify-end">
            <li>
              <button onClick={scrollToTop} className="focus:outline-none">
                <FaArrowCircleUp className=" text-[#2F60F3] text-3xl hover:text-[#2F60F3] transition duration-300" />
              </button>
            </li>
          </ul>

          <div className="text-right  mt-4 lg:mt-2 lg:text-center">
            <div className="text-sm  font-semibold ">
              <p>&copy; {new Date().getFullYear()} All Rights Reserved</p>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
