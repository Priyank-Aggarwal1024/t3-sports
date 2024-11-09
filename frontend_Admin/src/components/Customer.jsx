import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPhone, FiMail } from 'react-icons/fi';
import { HiLocationMarker } from 'react-icons/hi';

const Customer = () => {
  const [customers, setCustomers] = useState([]);

  useEffect(() => {
    // Fetch customer data when the component mounts
    const fetchCustomers = async () => {
      try {
        const response = await axios.get("/api/customers");
        setCustomers(response.data.customers);
      } catch (error) {
        console.error("Error fetching Customers:", error);
      }
    };
    fetchCustomers();
  }, []);

  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Customer List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {customers.map((customer, index) => (
          <div
            key={index}
            className="bg-white dark:bg-darkPrimary rounded-md shadow-md p-6"
          >
            <h3 className="text-2xl font-semibold mb-2 dark:text-white">
              {customer.fname} {customer.lname}
            </h3>
            <div className="text-gray-600 dark:text-gray-400 mb-2 flex items-center">
              <FiPhone className="mr-2" />
              {customer.phone}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customer;
