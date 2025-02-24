import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import PropTypes from "prop-types";
// Create the Orders context
const OrdersContext = createContext();

// Create a provider component
export const OrdersProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [todayOrders, setTodayOrders] = useState(0);
  const [todayRevenue, setTodayRevenue] = useState(0);
  const [aov, setAov] = useState(0);

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const response = await axios.get("/api/orders/"); // Make sure your route matches the API endpoint
      setOrders(response.data.orders); // Assuming your API response has `orders` key
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };
  const avereageOrderValue = () => {
    function getStartOfWeek(date) {
      const dayOfWeek = date.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6
      const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1); // Adjust when Sunday
      return new Date(date.setDate(diff));
    }

    // Get today's date and start of the week
    const today = new Date();
    const startOfWeek = getStartOfWeek(new Date()).toISOString().split("T")[0];

    // Filter orders for the current week
    const weeklyOrders = orders.filter(
      (order) =>
        order.dateOfOrder >= startOfWeek &&
        order.dateOfOrder <= today.toISOString().split("T")[0]
    );

    // Calculate total revenue for the week
    const totalWeeklyRevenue = weeklyOrders.reduce(
      (sum, order) => sum + parseFloat(order.totalAmount),
      0
    );
    setAov(
      weeklyOrders.length > 0 ? totalWeeklyRevenue / weeklyOrders.length : 0
    );
  };
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    const todayOrders = orders
      ? orders.filter((order) => {
          return (
            new Date(order.dateOfOrder).toISOString().split("T")[0] === today
          );
        })
      : [];
    setTodayOrders(todayOrders.length);
    setTodayRevenue(() =>
      todayOrders.reduce((sum, order) => sum + parseFloat(order.totalAmount), 0)
    );
    avereageOrderValue();
  }, [orders]);

  // Fetch orders on component mount
  useEffect(() => {
    fetchOrders();
  }, []);

  return (
    <OrdersContext.Provider
      value={{
        orders,
        loading,
        error,
        fetchOrders,
        todayOrders,
        todayRevenue,
        aov,
      }}
    >
      {children}
    </OrdersContext.Provider>
  );
};
OrdersProvider.propTypes = {
  children: PropTypes.node, // This tells React "children" can be any renderable content
};

// Create a custom hook to use the OrdersContext
export const useOrders = () => {
  return useContext(OrdersContext);
};
