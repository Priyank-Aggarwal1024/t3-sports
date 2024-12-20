// import React from 'react'
// import { useOrders } from '../contexts/OrdersContext.jsx';

// const AllOrders = () => {
//     const { orders, loading, error } = useOrders();

//     if (loading) return <p>Loading orders...</p>;
//     if (error) return <p>Error fetching orders: {error}</p>;
//     console.log(orders);
//     return (
//         <div className='dark:bg-black bg-lightPrimary text-darkText dark:text-lightPrimary px-16 my-16 flex flex-col justify-center'>
//             <h2 className='text-lg md:text-2xl font-bold'>Order List</h2>
//             {orders.length === 0 ? (
//                 <p>No orders found.</p>
//             ) : (
//                 <ul className='inline-flex flex-wrap gap-4 my-4'>
//                     {orders.map((order) => (
//                         <li key={order._id} className='p-4 border border-primary rounded-md w-fit'>
//                             <div>
//                                 <p>Name: {order.shipping_fname} {order.shipping_lname}</p>
//                                 <p>Phone: {order.shipping_phone}</p>
//                                 <p>#{order.id}</p>
//                                 <p>Status: {order.status}</p>
//                                 <p>{order.order_amount}</p>
//                                 <p>{order.order_date}</p>
//                                 <p>{order.order_number}</p>
//                                 <p>Package Size: {order.package_length} x {order.package_breadth} x {order.package_height}</p>
//                                 <p>Package Weight: {order.package_weight}g</p>
//                                 <p>Payment Method: {order.payment_method}</p>
//                                 {/* <p>Shipping Charges: {order.shippingDetails[0]?.shippingCharges}</p> */}
//                                 {/* <p>Tax Amount: {order.taxAmount}</p>
//                                 <p>Weight: {order.weight}</p>
//                                 <p>Volumetric Weight: {order.volumetricWeight}</p>
//                                 <p>Total Amount: ₹{order.totalAmount}</p> */}
//                                 <div>
//                                     <h2 className='text-xl text-primary'>Products</h2>
//                                     <ul className='flex flex-col'>
//                                         {order.products.map((item, index) => {
//                                             return(
//                                                 <li>
//                                                     {index+1} ) {item.product_name} | ₹{item.product_price} | {item.product_qty} Units
//                                                 </li>
//                                             )
//                                         })}
//                                     </ul>
//                                 </div>

//                                 <div>
//                                     <h2 className='text-xl text-primary'>Shipping Address</h2>
//                                     <p>Shipping Address: {order.shipping_address}</p>
//                                     <p>Shipping City: {order.shipping_city}</p>
//                                     <p>Shipping Country: {order.shipping_country}</p>
//                                     <p>Shipping State: {order.shipping_state}</p>
//                                     <p>Pin Code: {order.shipping_zip}</p>
//                                 </div>
//                             </div>
//                         </li>
//                     ))}
//                 </ul>
//             )}
//         </div>
//     )
// }

// export default AllOrders




import React, { useState, useEffect } from 'react';
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
    <div className="p-6">
      <div className='flex justify-between items-center'>
        <h2 className="text-lg md:text-2xl font-bold text-black dark:text-white my-6">Order List</h2>
        <div className="flex items-center gap-2 my-4">
          <button
            onClick={() => changePage(currentPage - 1)}
            disabled={currentPage === 0}
            className="py-1 px-2 bg-primary text-white rounded-md disabled:bg-gray-600"
          >
            <IoIosArrowBack className="" />
          </button>
          {/* <span className='text-black dark:text-white'>
          Page <strong>{currentPage + 1}</strong> of <strong>{totalPages}</strong>
        </span> */}
          <button
            onClick={() => changePage(currentPage + 1)}
            disabled={currentPage === totalPages - 1}
            className="py-1 px-2 bg-primary text-white rounded-md disabled:bg-gray-600"
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
              <tr key={order._id} className='text-sm'>
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
