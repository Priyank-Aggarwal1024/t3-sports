import axios from 'axios';
import React, { useEffect, useState } from 'react';
import toast from "react-hot-toast";

function useWarehouse(props) {
    const [count, setCount] = useState(0);
    const [warehouses, setWarehouse] = useState([]);
    const getWarehouse = async () => {
        try {
            const response = await axios.get("/api/warehouses");
            setWarehouse(response.data.warehouses);
        } catch (error) {
            console.error("Error fetching warehouses:", error);
        }
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
    useEffect(() => {
        getWarehouse();
    }, [count])
    return ({
        warehouses,
        createWarehouse,
        deleteWarehouse
    });
}

export default useWarehouse;