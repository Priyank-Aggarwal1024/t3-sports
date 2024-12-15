import React, { useState } from "react";
import axios from "axios";
import { customerInitialState } from "../utils/constants";

const CreateCustomer = () => {
  const [customer, setCustomer] = useState(customerInitialState);

  const [message, setMessage] = useState("");

  const handleSubmitCustomer = async () => {
    try {
      const { data } = await axios.post("/api/customers/create", customer);
      setMessage(data.customer ? "Customer created successfully" : "Customer already exists");
      setCustomer({
        fname: "",
        lname: "",
        phone: "",
      });
    } catch (err) {
      setMessage("An error occurred while creating the customer.");
    }
  };

  return (
    <div className="md:px-12 my-6">
      <h2 className="text-2xl my-6 font-bold dark:text-white text-black">Create Customer</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {["First Name", "Last Name", "Phone Number"].map((field) => (
          <input
            key={field}
            type="text"
            placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
            value={customer[field]}
            onChange={(e) => setCustomer({ ...customer, [field]: e.target.value })}
            required
            className="p-2 bg-darkPrimary px-4 rounded-lg"
          />
        ))}
        <button className="bg-primary text-white px-8 py-2 rounded-md" onClick={handleSubmitCustomer}>
          Create Customer
        </button>
      </div>
      {message && <p className="mt-4">{message}</p>}
    </div>
  );
};

export default CreateCustomer;
