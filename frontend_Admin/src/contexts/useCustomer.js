import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'

function useCustomer(props) {
    const [customers, setCustomers] = useState([]);
    const getCustomers = async () => {
        try {
            const { data } = await axios.get('/api/customers');
            setCustomers(data.customers);
        } catch (error) {
            console.error("Error searching customers:", error);
        }
    };
    const editCustomer = async (id, updatedata) => {
        console.log(id, updatedata)
        try {
            const { data } = await axios.put(`/api/customers/customer/${id}`, updatedata);
            if (data.customer) {
                toast.success("Customer address updated successfully.");
                return data.customer
            }
            else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }
        return;
    }
    const filterCustomerById = (id) => {
        const filtered = customers.filter((cus) => cus._id === id);
        return filtered[0];
    }
    useEffect(() => {
        getCustomers();
    }, [])
    return {
        customers,
        getCustomers,
        editCustomer,
        editCustomer,
        filterCustomerById
    }
}

export default useCustomer;