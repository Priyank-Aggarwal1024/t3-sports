import React, { useEffect, useState } from "react";
import axios from "axios";
import { customerFormControls, customerInitialState } from "../utils/constants";
import CustomerFormControls from "./CustomerFormControls";
import { createCustomerValidator } from "../utils/validators";
import { toast } from 'react-hot-toast'
import useCustomer from "../contexts/useCustomer";
import { useNavigate, useParams } from "react-router-dom";
const EditCustomer = () => {
    const { filterCustomerById } = useCustomer();
    const { id } = useParams();
    const [customer, setCustomer] = useState(customerInitialState);
    const [customerErrorState, setCustomerErrorState] = useState(customerInitialState);
    const [message, setMessage] = useState("");
    const navigate = useNavigate();
    const handleChange = (e) => {
        setCustomer({ ...customer, [e.target.name]: e.target.value })
    }
    const editCustomer = filterCustomerById(id);

    useEffect(() => {
        if (editCustomer) {
            const { __v, _id, createdAt, customerId, updatedAt, ...fields } = editCustomer;
            setCustomer(fields)
        }
    }, [editCustomer])
    const handleSubmitCustomer = async () => {
        try {
            setCustomerErrorState({ ...customerInitialState });
            const { error, message, field } = createCustomerValidator(customer);
            if (error) {
                setCustomerErrorState({ ...customerInitialState, [field]: message });
                return;
            }
            console.log(customer)
            const { data } = await axios.put(`/api/customers/customer/${id}`, customer);
            data?.customer ? toast.success("Customer edited successfully") : toast.error(data.message);
            if (data?.customer) {
                navigate("/");
            }
            setCustomer(customerInitialState);
        } catch (err) {
            setMessage("An error occurred while creating the customer.");
        }
    };

    return (
        <div className="bg-black lg:p-16 md:p-8 px-4 py-8">
            <div className="bg-lightPrimary dark:bg-darkPrimary rounded-lg shadow-md p-6">
                <h2 className="text-2xl my-6 font-bold dark:text-white text-black">Edit Customer</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-[74px] md:gap-y-12 gap-y-6">
                    {
                        customerFormControls.map((control, idx) => <CustomerFormControls {...control} customer={customer} handleChange={handleChange} customerErrorState={customerErrorState} key={idx} />)
                    }
                    <button className="bg-primary  md:col-span-2 text-white px-8 py-1 rounded-md h-fit " onClick={handleSubmitCustomer}>
                        Edit Customer
                    </button>
                </div>
                {message && <p className="mt-4 dark:text-white text-black">{message}</p>}
            </div>
        </div>
    );
};

export default EditCustomer;
