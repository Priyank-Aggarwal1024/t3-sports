import axios from "axios";
import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useParams } from "react-router-dom";
import useProducts from "../contexts/useProducts";

function OrderDetailPage() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const { products } = useProducts();
  useEffect(() => {
    const fetchOrderById = async (orderId) => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);

        if (response.data.success) {
          setOrder(response.data.order);
        } else {
          throw new Error(response.data.message || "Failed to fetch order?.");
        }
      } catch (error) {
        console.error("Error fetching order:", error);
        toast.error("Failed to load order details.");
      }
    };
    if (id) {
      fetchOrderById(id);
    }
  }, [id]);
  if (!order)
    return (
      <p className="text-center text-gray-500">Loading order details...</p>
    );
  return (
    <div className="dark:bg-black bg-gray-200 dark:text-white text-black min-h-screen p-6">
      <div className="w-full mx-auto bg-transparent p-6 rounded-lg shadow-sm dark:shadow-white">
        <h2 className="text-2xl font-bold text-center mb-4">Order Details</h2>

        {/* Order Number & Status */}
        <div className="mb-4">
          <p>
            <span className="font-semibold">Order #:</span>{" "}
            {order?.order_number}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            <b>{String(order?.status).toLocaleUpperCase()}</b>
          </p>
        </div>

        {/* Customer Info */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Customer Info
          </h3>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {order?.customer?.fname} {order?.customer?.lname}
          </p>
          <p>
            <span className="font-semibold">Email:</span>{" "}
            {order?.customer?.email || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Phone:</span>{" "}
            {order?.customer?.phone || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Address:</span>{" "}
            {order?.customer?.address || "N/A"},{" "}
            {order?.customer?.city || "N/A"}, {order?.customer?.state || "N/A"},{" "}
            {order?.customer?.country || "N/A"} -{" "}
            {order?.customer?.pincode || "N/A"}
          </p>
        </div>

        {/* Shipping Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Shipping Details
          </h3>
          <p>
            <span className="font-semibold">Type:</span> {order?.shipping_type}
          </p>
          <p>
            <span className="font-semibold">Charges:</span> ₹
            {order?.shippingDetails?.shippingCharges || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Tracking:</span>{" "}
            <a
              href={order?.trackinglink}
              className="text-blue-400 underline"
              target="_blank"
              rel="noopener noreferrer"
            >
              Track Order
            </a>
          </p>
        </div>

        {/* Payment Details */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Payment Details
          </h3>
          <p>
            <span className="font-semibold">Method:</span>{" "}
            {order?.payment_method}
          </p>
          <p>
            <span className="font-semibold">Status:</span>{" "}
            {order?.payment_status}
          </p>
          <p>
            <span className="font-semibold">Amount:</span> ₹{order?.amount}
          </p>
        </div>

        {/* Product List */}
        <div className="mb-4">
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Products
          </h3>
          {order?.products.map((product) => (
            <div
              key={product._id}
              className="border-b border-gray-700 py-2 flex justify-between"
            >
              <p>
                <span className="font-semibold">Name:</span>{" "}
                {product?.productName}
              </p>
              <p>
                <span className="font-semibold">Quantity:</span>{" "}
                {product?.quantity}
              </p>
              <p>
                <span className="font-semibold">Price:</span> ₹{product?.price}
              </p>
              <p>
                <span className="font-semibold">Size:</span>{" "}
                {products.find((p) => p._id == product?._id)?.size}
              </p>
            </div>
          ))}
        </div>

        {/* Warehouse Info */}
        <div>
          <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">
            Warehouse Info
          </h3>
          <p>
            <span className="font-semibold">Name:</span>{" "}
            {order?.warehouse_id?.name || "N/A"}
          </p>
          <p>
            <span className="font-semibold">Location:</span>{" "}
            {order?.warehouse_id?.address || "N/A"}
          </p>
        </div>
      </div>

      {/* Toast Notifications */}
    </div>
  );
}

export default OrderDetailPage;
