import React, { useState } from 'react';
import { useOrders } from '../contexts/OrdersContext.jsx';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';

const AllOrders = () => {
  const { orders, loading, error } = useOrders();

  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(15); // Display 15 orders per page

  // Calculate total number of pages
  const totalPages = Math.ceil(orders?.length / ordersPerPage);

  // Function to change the page
  const changePage = (page) => {
    if (page < 0 || page >= totalPages) return; // Prevent going out of bounds
    setCurrentPage(page);
  };

  // Slice orders for the current page
  const currentOrders = orders?.slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage);

  // Loading and error handling
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error}</p>;

  // If no orders, show a message
  if (!Array.isArray(orders) || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="p-6 dark:bg-black bg-white">
      <div className='flex justify-between items-center'>
        <h2 className="text-lg md:text-2xl lg:text-3xl font-bold text-black dark:text-white my-6">Order List</h2>
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 0}
            className="py-1 px-2 bg-[#2F60F3] text-white rounded-md disabled:bg-gray-600"
          >
            <IoIosArrowBack className="" />
          </button>
          {/* <span className='text-black dark:text-white'>
          Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
        </span> */}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="py-1 px-2 bg-[#2F60F3] text-white rounded-md disabled:bg-gray-600"
          >
            <IoIosArrowForward className="" />
          </button>
        </div>
      </div>
      <div className="w-full overflow-x-auto">

        <table className="min-w-full bg-white dark:bg-black dark:text-white border border-gray-800">
          <thead className="dark:bg-darkPrimary">
            <tr className='text-sm text-left'>
              <th className="py-2 px-4 border border-gray-600 whitespace-nowrap">Serial No.</th>
              <th className="py-2 px-4 border border-gray-600">Order ID</th>
              <th className="py-2 px-4 border border-gray-600">Customer Name</th>
              <th className="py-2 px-4 border border-gray-600">Phone</th>
              <th className="py-2 px-4 border border-gray-600">Order Amount</th>
              <th className="py-2 px-4 border border-gray-600">Order Date</th>
              <th className="py-2 px-4 border border-gray-600">Status</th>
              <th className="py-2 px-4 border border-gray-600">Package Size</th>
              <th className="py-2 px-4 border border-gray-600">Package Weight</th>
              <th className="py-2 px-4 border border-gray-600">Payment Method</th>
            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index} className='text-sm'>
                <td className="py-2 px-4 border border-gray-600">{index + 1 + (currentPage * ordersPerPage)}</td>
                <td className="py-2 px-4 border border-gray-600">{order.id}</td>
                <td className="py-2 px-4 border border-gray-600">{`${order.shipping_fname} ${order.shipping_lname}`}</td>
                <td className="py-2 px-4 border border-gray-600">{order.shipping_phone}</td>
                <td className="py-2 px-4 border border-gray-600">₹{order.order_amount}</td>
                <td className="py-2 px-4 border border-gray-600">{order.order_date}</td>
                <td className="py-2 px-4 border border-gray-600">
                  <span className={`py-1 rounded-full px-3 text-xs ${order.status === 'cancelled' ? 'bg-red-500' :
                    order.status === 'booked' ? 'bg-green-500' :
                      order.status === 'new' ? 'bg-orange-400' :
                        ''
                    }`}>{order.status}</span>
                </td>
                <td className="py-2 px-4 border border-gray-600">{`${order.package_length} x ${order.package_breadth} x ${order.package_height}`}</td>
                <td className="py-2 px-4 border border-gray-600">{`${order.package_weight}g`}</td>
                <td className="py-2 px-4 border border-gray-600">{order.payment_method}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default AllOrders;
