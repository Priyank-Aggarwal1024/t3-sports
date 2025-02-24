import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";

function useWarehouse() {
  const [count, setCount] = useState(0);
  const [warehouses, setWarehouse] = useState([]);
  const [wloading, setWloading] = useState(false);
  const getWarehouse = async () => {
    setWloading(true);
    try {
      const response = await axios.get("/api/warehouses");
      setWarehouse([...response.data.warehouses]);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
    setWloading(false);
  };
  const createWarehouse = async (createdata) => {
    try {
      const { data } = await axios.post("/api/warehouses/create", createdata);
      data?.warehouse
        ? toast.success("Warehouse created successfully")
        : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
    setCount((prev) => (prev + 1) % 1001);
    return;
  };
  const deleteWarehouse = async (wid) => {
    try {
      const { data } = await axios.delete(`/api/warehouses/${wid}`);
      data?.warehouse
        ? toast.success("Warehouse deleted successfully")
        : toast.error(data.message);
    } catch (err) {
      toast.error(err.message);
    }
    setCount((prev) => (prev + 1) % 1001);
    return;
  };
  const addProductInWarehouse = async (wid, pid, quantity) => {
    try {
      const { data } = await axios.put(`/api/warehouses/add-product/${wid}`, {
        productId: pid,
        quantity,
      });
      if (data.success) {
        toast.success(data.message);
        setCount((prev) => (prev + 1) % 1001);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const removeProductInWarehouse = async (wid, pid) => {
    try {
      const { data } = await axios.put(
        `/api/warehouses/remove-product/${wid}`,
        { productId: pid }
      );
      if (data.success) {
        toast.success(data.message);
        setCount((prev) => (prev + 1) % 1001);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const editWarehouseProductQuantity = async (warehouseEdit) => {
    try {
      // Input validation
      if (
        !warehouseEdit.warehouse ||
        !warehouseEdit.productId ||
        warehouseEdit.quantity === undefined
      ) {
        toast.error("Warehouse ID, Product ID, and quantity are required.");
      }

      if (
        typeof warehouseEdit.quantity !== "number" ||
        warehouseEdit.quantity < 0
      ) {
        toast.error("Quantity must be a non-negative number.");
      }

      // API request
      const response = await axios.put(
        `/api/warehouses/edit-product-quantity/${warehouseEdit.warehouse}`,
        {
          productId: warehouseEdit.productId,
          quantity: warehouseEdit.quantity,
        }
      );
      if (response.data.success) {
        toast.success(response.data?.message);
        setWarehouse([
          ...warehouses.map((w) => {
            if (w._id == warehouseEdit.warehouse) {
              w.products = w.products.map((wp) => {
                if (wp.productId._id == warehouseEdit.productId) {
                  return { ...wp, quantity: warehouseEdit.quantity };
                } else {
                  return wp;
                }
              });
              return w;
            } else {
              return w;
            }
          }),
        ]);
        setCount((prev) => (prev + 1) % 1001);
      } else {
        console.error(
          "Failed to update product quantity:",
          response.data.message
        );
        toast.error(response.data.message);
      }
    } catch (error) {
      toast.error(`Error updating product quantity: ${error.message}`);
    }
  };
  useEffect(() => {
    getWarehouse();
  }, [count]);
  return {
    warehouses,
    createWarehouse,
    deleteWarehouse,
    wloading,
    addProductInWarehouse,
    removeProductInWarehouse,
    editWarehouseProductQuantity,
    count,
  };
}

export default useWarehouse;
