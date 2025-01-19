import axios from 'axios';
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast'

function useCustomer(props) {
    const [customers, setCustomers] = useState([]);
    const [ccounter, setCcounter] = useState(0);
    const [cloading, setCloading] = useState(false)
    const getCustomers = async () => {
        setCloading(true)
        try {
            const { data } = await axios.get('/api/customers');
            setCustomers(data.customers);
        } catch (error) {
            console.error("Error searching customers:", error);
        }
        setCloading(false)
    };
    const editCustomer = async (id, updatedata) => {
        try {
            const { data } = await axios.put(`/api/customers/customer/${id}`, updatedata);
            if (data.customer) {
                toast.success("Customer address updated successfully.");
                setCcounter((prev) => (prev + 1) % 1001)

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
    const deleteCustomer = async (id) => {
        try {
            const { data } = await axios.delete(`/api/customers/customer/${id}`);
            if (data.success) {
                toast.success(data.message);
                setCcounter((prev) => (prev + 1) % 1001)
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
        if (filtered)
            return filtered[0];
    }
    useEffect(() => {
        getCustomers();
    }, [ccounter])
    return {
        customers,
        getCustomers,
        editCustomer,
        editCustomer,
        filterCustomerById,
        deleteCustomer,
        cloading
    }
}

export default useCustomer;