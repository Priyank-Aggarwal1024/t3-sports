import React, { useState } from "react";

const Accordion = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="">
      <div
        className="cursor-pointer bg-gray-200 text-white dark:bg-darkPrimary p-4 rounded-md flex justify-between items-center"
        onClick={() => setIsOpen(!isOpen)}
      >
        <h3 className="text-lg font-semibold">{title}</h3>
        <span>{isOpen ? "-" : "+"}</span>
      </div>
      {isOpen && <div className="p-4 bg-gray-50 dark:bg-darkPrimary mt-2 rounded-md">{children}</div>}
    </div>
  );
};

export default Accordion;
