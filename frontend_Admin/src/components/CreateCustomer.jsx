import React, { useState } from "react";
import axios from "axios";
import { customerFormControls, customerInitialState } from "../utils/constants";
import CustomerFormControls from "./CustomerFormControls";
import { createCustomerValidator } from "../utils/validators";
import { toast } from "react-hot-toast";
const CreateCustomer = () => {
  const [customer, setCustomer] = useState(customerInitialState);
  const [customerErrorState, setCustomerErrorState] =
    useState(customerInitialState);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleChange = (e) => {
    setCustomer({ ...customer, [e.target.name]: e.target.value });
    setCustomerErrorState({ ...customerErrorState, [e.target.name]: "" });
  };
  const handleSubmitCustomer = async () => {
    try {
      setCustomerErrorState({ ...customerInitialState });
      const { error, message, field } = createCustomerValidator(customer);
      if (error) {
        setCustomerErrorState({ ...customerInitialState, [field]: message });
        return;
      }
      setLoading(true);
      const { data } = await axios.post("/api/customers/create", customer);
      data?.customer
        ? toast.success("Customer created successfully")
        : toast.error("Customer already exists");
      setCustomer(customerInitialState);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      setMessage("An error occurred while creating the customer.");
    }
  };

  return (
    <div className="dark:bg-darkPrimary rounded-lg shadow-md">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[74px] md:gap-y-12 gap-y-6">
        {customerFormControls.map((control, idx) => (
          <CustomerFormControls
            key={idx}
            {...control}
            customer={customer}
            handleChange={handleChange}
            customerErrorState={customerErrorState}
          />
        ))}
        <button
          className="bg-[#2F60F3] flex items-center justify-center gap-4 md:col-span-2 text-white px-8 py-1 rounded-md h-fit "
          onClick={handleSubmitCustomer}
        >
          {loading && <span className="loader"></span>}
          <span>Create Customer</span>
        </button>
      </div>
      {message && <p className="mt-4 dark:text-white text-black">{message}</p>}
    </div>
  );
};

export default CreateCustomer;
