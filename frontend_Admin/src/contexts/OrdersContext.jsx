import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

// Create the Orders context
const OrdersContext = createContext();

// Create a provider component
export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/orders/"); // Make sure your route matches the API endpoint
      setOrders(response.data.data); // Assuming your API response has `orders` key
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrdersContext.Provider value={{ orders, loading, error, fetchOrders }}>
      {children}
    </OrdersContext.Provider>
  );
};

// Create a custom hook to use the OrdersContext
export const useOrders = () => {
  return useContext(OrdersContext);
};
