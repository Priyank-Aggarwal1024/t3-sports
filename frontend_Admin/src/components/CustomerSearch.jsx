import React, { useState } from 'react';
import axios from 'axios';
import { useEffect } from 'react';
import useCustomer from '../contexts/useCustomer';

const CustomerSearch = ({ selectedCustomer, setSelectedCustomer }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { customers } = useCustomer();


  const customerFilter = (customer) => {
    const regex = new RegExp(searchQuery, 'i');
    return regex.test(customer.fname) ||
      regex.test(customer.lname) ||
      regex.test(customer.phone) ||
      regex.test(customer.email) ||
      regex.test(customer.customerId)
  }
  return (
    <div className="p-2 dark:text-white text-black">
      {/* <h2 className="text-2xl font-bold mb-4">Search Customer</h2> */}
      <div className="mb-4 flex flex-col md:flex-row items-center gap-2">
        <input
          type="text"
          placeholder="Search by name, email, or phone"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="p-2  rounded-lg w-full placeholder:text-sm text-sm dark:bg-black dark:text-white text-black bg-white shadow-md"
        />
      </div>

      <div>
        {customers.length > 0 ? (
          <ul className="bg-white dark:bg-black max-h-[150px] overflow-y-auto rounded-md shadow-md p-4 dark:text-white text-black">
            {customers.map((customer) => customerFilter(customer) && (
              <li
                key={customer._id}
                onClick={() => setSelectedCustomer(customer)}
                className={`p-2 border-b border-gray-300 dark:border-gray-700 cursor-pointer ${selectedCustomer?._id === customer._id ? 'bg-primary text-white' : ''
                  }`}
              >
                {customer.fname} {customer.lname} - {customer.phone}
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-gray-600 dark:text-gray-400 text-sm">No customers found. Try a different search query.</p>
        )}
      </div>

      {selectedCustomer && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold dark:text-white text-black">
            Selected Customer: {selectedCustomer.fname} {selectedCustomer.lname}
          </h3>
        </div>
      )}
    </div>
  );
};

export default CustomerSearch;
