import axios from 'axios';
import { useEffect, useState } from 'react';
import toast from "react-hot-toast";

function useWarehouse(props) {
    const [count, setCount] = useState(0);
    const [warehouses, setWarehouse] = useState([]);
    const [wloading, setWloading] = useState(false)

    const getWarehouse = async () => {
        setWloading(true);
        try {
            const response = await axios.get("/api/warehouses");
            setWarehouse(response.data.warehouses);
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
        setWloading(false);
    }
    const createWarehouse = async (createdata) => {
        try {
            const { data } = await axios.post("/api/warehouses/create", createdata);
            data?.warehouse ? toast.success("Warehouse created successfully") : toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
        setCount((prev) => (prev + 1) % 1001);
        return;
    }
    const deleteWarehouse = async (wid) => {
        try {
            const { data } = await axios.delete(`/api/warehouses/${wid}`);
            data?.warehouse ? toast.success("Warehouse deleted successfully") : toast.error(data.message);
        } catch (err) {
            toast.error(err.message);
        }
        setCount((prev) => (prev + 1) % 1001);
        return;
    }
    const addProductInWarehouse = async (wid, pid) => {
        try {
            const { data } = await axios.put(`/api/warehouses/add-product/${wid}`, { productId: pid });
            if (data.success) {
                toast.success(data.message);
                setCount((prev) => (prev + 1) % 1001);

            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }

    }
    const removeProductInWarehouse = async (wid, pid) => {
        try {
            const { data } = await axios.put(`/api/warehouses/remove-product/${wid}`, { productId: pid });
            if (data.success) {
                toast.success(data.message);
                setCount((prev) => (prev + 1) % 1001);

            } else {
                toast.error(data.message);
            }
        } catch (err) {
            toast.error(err.message);
        }

    }
    useEffect(() => {
        getWarehouse();
    }, [count])
    return ({
        warehouses,
        createWarehouse,
        deleteWarehouse,
        wloading,
        addProductInWarehouse,
        removeProductInWarehouse
    });
}

export default useWarehouse;