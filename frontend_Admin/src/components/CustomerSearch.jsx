import React, { useState } from "react";
import { useEffect } from "react";
import useCustomer from "../contexts/useCustomer";
import search from "../assets/search.svg";
import PropTypes from "prop-types";

const CustomerSearch = ({ selectedCustomer, setSelectedCustomer }) => {
  const [searchQuery, setSearchQuery] = useState("");
  const { customers } = useCustomer();
  const [filterdCustomer, setFilteredCustomer] = useState([]);

  const handlSelectCustomer = (customer) => {
    setSelectedCustomer(
      customer._id == selectedCustomer?._id ? null : customer
    );
    setSearchQuery("");
  };
  const customerFilter = (customer) => {
    const regex = new RegExp(searchQuery, "i");
    return (
      regex.test(customer.fname) ||
      regex.test(customer.lname) ||
      regex.test(customer.phone) ||
      regex.test(customer.email) ||
      regex.test(customer.customerId)
    );
  };

  useEffect(() => {
    if (searchQuery.trim() !== "") {
      setFilteredCustomer(() =>
        customers.filter((customer) => customerFilter(customer))
      );
    }
  }, [searchQuery]);
  return (
    <div className="w-full">
      <div className="w-full flex md:items-center md:gap-6 gap-3 md:flex-row flex-col">
        <label
          htmlFor="customersearch"
          className="text-xl min-w-40 block font-semibold text-gray-800 dark:text-white"
        >
          Select Customer
        </label>
        <div className="w-full md:py-4 py-2 md:px-6 px-3 dark:bg-[#121212] bg-gray-300 rounded-[10px] flex justify-between dark:text-white text-black md:text-xl text-md font-normal font-['Inter'] relative">
          <div className="flex items-center gap-2.5 w-full relative z-[1]">
            <img src={search} alt="Search" className="md:w-7 md:h-7 w-5 h-5" />
            <input
              type="text"
              id="customersearch"
              name="customersearch"
              placeholder="Search by name, email, or phone"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent placeholder:dark:text-[#858585] placeholder:text-gray-700 outline-none border-none w-full"
            />
          </div>
          {searchQuery.trim() !== "" && (
            <div className="absolute top-full mt-1 rounded-[10px] w-full z-[10] py-6 dark:bg-black bg-gray-300 shadow-xl dark:border left-0 px-4">
              <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
                {filterdCustomer.length > 0 ? (
                  filterdCustomer.map((customer) => (
                    <div
                      key={customer._id}
                      className={`py-2 px-1 border flex justify-between items-center w-full border-gray-600 rounded-md cursor-pointer dark:text-white text-black text-center hover:bg-[#2f60f3cc] ${
                        selectedCustomer &&
                        selectedCustomer._id == customer._id &&
                        "bg-[#2F60F3] "
                      }`}
                      onClick={() => handlSelectCustomer(customer)}
                    >
                      <li
                        key={customer._id}
                        onClick={() => setSelectedCustomer(customer)}
                        className={`p-2 cursor-pointer`}
                      >
                        {customer.fname} {customer.lname} - {customer.phone}
                      </li>
                    </div>
                  ))
                ) : (
                  <div className="dark:text-[#e2e2e2] text-[#202020] text-xl py-3 font-normal font-['Inter'] w-full text-center">
                    No Search Result found
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      <div>
        {selectedCustomer ? (
          <div className="lg:p-8 md:p-6 p-4 border flex justify-between items-center w-full border-gray-600 rounded-xl dark:bg-[#121212] bg-gray-300 dark:text-white text-black text-center lg:mt-12 md:mt-6 mt-3">
            <h3 className="text-lg font-semibold dark:text-white text-black">
              Selected Customer : {selectedCustomer.fname}{" "}
              {selectedCustomer.lname} - {selectedCustomer.phone}
            </h3>
          </div>
        ) : (
          <div className="dark:text-[#e2e2e2] text-[#202020] md:text-xl text-lg md:py-6 py-4 font-normal font-['Inter'] w-full text-center">
            No Customer Selected
          </div>
        )}
      </div>
    </div>
  );
};
CustomerSearch.propTypes = {
  selectedCustomer: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fname: PropTypes.string.isRequired,
      lname: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }),
    PropTypes.oneOf([null]),
  ]),
  setSelectedCustomer: PropTypes.func.isRequired,
};

export default CustomerSearch;
