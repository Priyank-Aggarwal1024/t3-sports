import React, { useState } from "react";
import PropTypes from "prop-types";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="w-full">
      <div
        className="cursor-pointer bg-gray-200 text-white dark:bg-darkPrimary p-4 rounded-md flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold dark:text-white text-black">
          {title}
        </h3>
        <span className="dark:text-white text-black text-lg">
          {isOpen ? "-" : "+"}
        </span>
      </div>
      {isOpen && (
        <div className="p-4 bg-gray-50 dark:bg-darkPrimary mt-2 rounded-md">
          {children}
        </div>
      )}
    </div>
  );
};
Accordion.propTypes = {
  title: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
};
export default Accordion;
