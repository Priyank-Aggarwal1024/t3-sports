import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FiPhone, FiMail } from 'react-icons/fi';
import useCustomer from '../contexts/useCustomer';
import { MdDelete, MdEdit } from 'react-icons/md';
import { useNavigate } from 'react-router-dom';

const Customer = () => {
  const { deleteCustomer, customers, cloading } = useCustomer();
  const navigate = useNavigate();
  return (
    <div className="my-8">
      <h2 className="text-3xl font-bold mb-6 text-black dark:text-white">Customer List</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {cloading ? <div className="text-white text-xl">Loading...</div> : customers.map((customer, index) => (
          <div
            key={index}
            className="bg-white dark:bg-darkPrimary rounded-md shadow-md p-6 flex gap-4 items-center"
          >
            <div className="w-full">

              <h3 className="text-2xl font-semibold mb-2 dark:text-white">
                {customer.fname} {customer.lname}
              </h3>
              <div className="text-gray-600 dark:text-gray-400 mb-2 flex items-center">
                <FiPhone className="mr-2" />
                {customer.phone}
              </div>
            </div>
            <div className=" flex flex-col gap-4">

              <button
                onClick={() => deleteCustomer(customer._id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 transition duration-200"
              >
                <MdDelete />
              </button>
              <button
                onClick={() => navigate(`/edit-customer/${customer._id}`)}
                className="bg-yellow-600 hover:bg-yellow-700 text-white rounded-md py-2 px-4 transition duration-200"
              >
                <MdEdit />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Customer;
