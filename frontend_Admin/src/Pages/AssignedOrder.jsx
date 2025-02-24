import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { MdDeleteForever } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import useProducts from "../contexts/useProducts";
import PropTypes from "prop-types";

const OrderCard = ({ order, handleDeleteOrder }) => {
  const navigate = useNavigate();
  const { products } = useProducts();
  return (
    <div className="dark:bg-black bg-gray-200 flex flex-col justify-between dark:text-white text-black shadow-md rounded-lg p-4 mb-4 border border-gray-200">
      {/* Order Header */}
      <div className="flex justify-between items-center border-b pb-2 mb-3">
        <h2 className="text-lg font-bold">Order #{order.order_number}</h2>
        <div className="flex gap-2 items-center">
          <span
            className={`text-sm font-semibold px-3 py-1 rounded ${
              order.status === "ordered"
                ? "bg-blue-100 text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {order.status.toUpperCase()}
          </span>
          <MdDeleteForever
            className="text-red-500 text-2xl cursor-pointer mx-2"
            onClick={() => handleDeleteOrder(order._id)}
          />
        </div>
      </div>

      {/* Customer Details */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1">Customer:</h3>
        <p>{`${order.customer.fname} ${order.customer.lname}`}</p>
        <p>{order.customer.email}</p>
        <p>{order.customer.phone}</p>
      </div>

      {/* Shipping Details */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1">Shipping Address:</h3>
        <p>{order.shippingDetails.shippingAddress.address}</p>
        <p>{`${order.shippingDetails.shippingAddress.city}, ${order.shippingDetails.shippingAddress.state}, ${order.shippingDetails.shippingAddress.country}`}</p>
        <p>Pincode: {order.shippingDetails.shippingAddress.pincode}</p>
      </div>

      {/* Product Details */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1">Products:</h3>
        <ul>
          {order.products.map((product) => (
            <li
              key={product._id}
              className="flex justify-between items-center text-sm border-b py-2"
            >
              <span className="w-1/3">{product.productName}</span>
              <span className="w-1/3 text-right">
                {products.find((p) => p._id == product._id)?.size}
              </span>
              <span className="w-1/3 text-right">
                {product.quantity} x ₹{product.price}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Payment Details */}
      <div className="mb-4">
        <h3 className="text-md font-semibold mb-1">Payment:</h3>
        <p>Status: {order.payment_status}</p>
        <p>Method: {order.payment_method}</p>
        <p>Total Amount: ₹{order.totalAmount}</p>
      </div>

      {/* Warehouse Info */}
      <div>
        <h3 className="text-md font-semibold mb-1">Warehouse:</h3>
        <p>{order.warehouse_id.name}</p>
        <p>{order.warehouse_id.email}</p>
      </div>
      <div className="flex w-full">
        <button
          onClick={() => navigate(`/orders/assigned/${order._id}`)}
          className="bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded shadow focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 transition duration-150 mt-4 text-center w-full"
        >
          Fulfill Order
        </button>
      </div>
    </div>
  );
};

OrderCard.propTypes = {
  order: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    order_number: PropTypes.string.isRequired,
    status: PropTypes.string.isRequired,
    customer: PropTypes.shape({
      fname: PropTypes.string.isRequired,
      lname: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
      phone: PropTypes.string.isRequired,
    }).isRequired,
    shippingDetails: PropTypes.shape({
      shippingAddress: PropTypes.shape({
        address: PropTypes.string.isRequired,
        city: PropTypes.string.isRequired,
        state: PropTypes.string.isRequired,
        country: PropTypes.string.isRequired,
        pincode: PropTypes.string.isRequired,
      }).isRequired,
    }).isRequired,
    products: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        productName: PropTypes.string.isRequired,
        quantity: PropTypes.number.isRequired,
        price: PropTypes.number.isRequired,
      })
    ).isRequired,
    payment_status: PropTypes.string.isRequired,
    payment_method: PropTypes.string.isRequired,
    totalAmount: PropTypes.number.isRequired,
    warehouse_id: PropTypes.shape({
      name: PropTypes.string.isRequired,
      email: PropTypes.string.isRequired,
    }).isRequired,
  }).isRequired,
  handleDeleteOrder: PropTypes.func.isRequired,
};
function AssignedOrder() {
  const [orders, setOrders] = useState([]);
  const fetchAssignOrders = async () => {
    try {
      const response = await axios.get("/api/orders/assigned");
      if (response.data.success) {
        setOrders(response.data.data);
        toast.success(response.data.message);
      } else {
        setOrders([]);
        toast.error(response.data.message);
      }
    } catch (err) {
      setOrders([]);
      toast.error(err.message);
    }
  };
  const handleDeleteOrder = async (id) => {
    try {
      const confirmdelete = window.confirm(
        `Are you sure want to delete this order!`
      );
      if (!confirmdelete) {
        return;
      }
      const response = await axios.delete(`/api/orders/${id}`);
      if (response.data.success) {
        toast.success(response.data.message);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
    fetchAssignOrders();
  };
  useEffect(() => {
    fetchAssignOrders();
  }, []);
  return (
    <div className="dark:bg-black bg-white sm:px-8 p-4">
      <h1 className="text-2xl font-bold mb-4 dark:text-white">
        Assigned Orders
      </h1>

      {orders.length === 0 ? (
        <p className="text-gray-500">No orders available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {orders.map((order) => (
            <OrderCard
              key={order._id}
              order={order}
              handleDeleteOrder={handleDeleteOrder}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default AssignedOrder;
