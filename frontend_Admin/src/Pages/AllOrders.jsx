import React, { useEffect, useState } from 'react';
import { useOrders } from '../contexts/OrdersContext.jsx';
import { IoIosArrowBack, IoIosArrowForward } from 'react-icons/io';
import { FaFileAlt, FaUserAlt } from 'react-icons/fa'; // Import FontAwesome icons
import { exportToExcel } from 'react-json-to-excel';
import toast from 'react-hot-toast';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AllOrders = () => {
  const { orders, loading, error, fetchOrders } = useOrders();
  const [filterBy, setFilterBy] = useState("");
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [ordersPerPage] = useState(15);

  const totalPages = Math.ceil(orders?.length / ordersPerPage);
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [orderNumber, setOrderNumber] = useState('');
  const [searchText, setSearchText] = useState("");
  const [updateOrderId, setUpdateOrderId] = useState("");
  const [status, setStatus] = useState("");
  const [trackinglink, setTrackingLink] = useState("");

  const [filteredOrders, setFilteredOrders] = useState(orders);
  const changePage = (page) => {
    if (page < 0 || page >= totalPages) return;
    setCurrentPage(page);
  };
  const handleChangeFilterBy = ({ target }) => {
    setFilterBy(target.value);
  }
  const filterHandler = () => {
    if (filterBy == "date") {
      if (!fromDate || !toDate) {
        setFilteredOrders(orders);
        return;
      }

      const filtered = orders.filter(order => {
        const orderDate = new Date(order.dateOfOrder);
        const startDate = new Date(fromDate);
        const endDate = new Date(toDate);
        return orderDate >= startDate && orderDate <= endDate;
      });

      setFilteredOrders(filtered);
    }
    if (filterBy == "orderid") {
      const filtered = orders.filter(order => {
        const isOrderNumberMatch = orderNumber
          ? String(order.order_number).includes(orderNumber.trim())
          : true;

        // Check if orderDate is within the range
        return (
          isOrderNumberMatch
        );
      });

      setFilteredOrders(filtered);
    }
    if (filterBy == "cname") {
      const regex = new RegExp(searchText, "i")

      const filtered = orders.filter(order => {
        return regex.test(order?.customer?.fname) ||
          regex.test(order?.customer?.lname)
      });

      setFilteredOrders(filtered);
    }
  };
  const currentOrders = filteredOrders?.slice(currentPage * ordersPerPage, (currentPage + 1) * ordersPerPage);
  const handleSaveOrder = async () => {
    if (!status) {
      alert("Select valid status");
      setUpdateOrderId("");
      return;
    }
    try {
      const response = await axios.put(`/api/orders/update/${updateOrderId}`, { status, trackinglink });
      if (response.data.success) {
        toast.success(response.data.message);
        fetchOrders()
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message)
    }
    setUpdateOrderId("")
  }
  useEffect(() => {
    let tl = orders ? orders.find((order) => {
      if (order._id == updateOrderId) {
        return order;
      }
    }) : ""
    setTrackingLink(tl?.trackinglink || "");
  }, [updateOrderId])
  useEffect(() => {
    console.log(status)
  }, [])
  useEffect(() => {
    setFilteredOrders(orders);
  }, [orders])
  const filterAndTransformOrders = () => {
    const transformedOrders = filteredOrders.map(order => {
      const { customer, ...rest } = order; // Remove the customer field
      return {
        ...rest,
        customerFname: customer?.fname,
        customerLname: customer?.lname,
      };
    });
    return transformedOrders;
  };
  if (loading) return <p>Loading orders...</p>;
  if (error) return <p>Error fetching orders: {error}</p>;

  // If no orders, show a message
  if (!Array.isArray(orders) || orders.length === 0) {
    return <p>No orders found.</p>;
  }

  return (
    <div className="p-6 dark:bg-black bg-white">
      <div className='flex justify-between items-center lg:flex-row flex-col gap-6 my-6'>
        <div className="w-full flex justify-between xs:items-center xs:gap-6 gap-4 xs:flex-row flex-col">
          <h2 className="text-lg md:text-2xl w-full lg:text-3xl font-bold text-black dark:text-white">Order List</h2>
          <select
            id={"filter-by"}
            name={"filter-by"}
            placeholder={"Select Filter By"}
            // value={value}
            onChange={handleChangeFilterBy}
            className="w-full border px-4 py-2 max-w-60 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value={""} className="w-full dark:bg-gray-600 dark:text-white">Select Filter By Option</option>
            <option value={"date"} className="w-full dark:bg-gray-600 dark:text-white">Dates</option>
            <option value={"orderid"} className="w-full dark:bg-gray-600 dark:text-white">Order Id</option>
            <option value={"cname"} className="w-full dark:bg-gray-600 dark:text-white">Customer Name</option>
          </select>
        </div>
        <div className="w-full flex justify-between md:items-center md:flex-row flex-col items-start">
          <div className="flex md:items-center justify-between items-center md:mx-4 gap-4  w-full">
            {filterBy === "date" ? <div className="dark:text-white md:flex-row flex-col items-start flex md:items-center gap-4">
              <div className="flex w-full items-center justify-between gap-4">
                <label htmlFor="fromDate" className="text-lg">From:</label>
                <input
                  type="date"
                  id="fromDate"
                  value={fromDate}
                  onChange={(e) => setFromDate(e.target.value)}
                  className="all-orders-inp-date p-2 border rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />

              </div>
              <div className="flex w-full items-center justify-between gap-4">
                <label htmlFor="toDate" className="text-lg">To:</label>
                <input
                  type="date"
                  id="toDate"
                  value={toDate}
                  onChange={(e) => setToDate(e.target.value)}
                  className="all-orders-inp-date p-2 border rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                />
              </div>
            </div> : filterBy === "orderid" ?
              <div className="dark:text-white md:flex-row flex-col items-start flex md:items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(e) => setOrderNumber(e.target.value)}
                    className="p-2 pl-10 pr-4 border rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <FaFileAlt
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400"
                    size={20}
                  />
                </div>

              </div> : filterBy === "cname" && <div className="dark:text-white md:flex-row flex-col items-start flex md:items-center gap-4">
                <div className="relative">
                  <input
                    type="text"
                    id="serachtext"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                    className="p-2 pl-10 pr-4 border rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                  <FaUserAlt
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400"
                    size={20}
                  />
                </div>

              </div>}

            <button
              onClick={filterHandler}
              className="py-2 px-4 bg-blue-500 h-fit text-white rounded-md shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
            >
              Filter
            </button>
          </div>
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
              <th className="py-2 px-4 border border-gray-600">Package Weight</th>
              <th className="py-2 px-4 border border-gray-600">Payment Method</th>
              <th className="py-2 px-4 border border-gray-600">Order Type</th>
              <th className="py-2 px-4 border border-gray-600">Order Tracking Link</th>

            </tr>
          </thead>
          <tbody>
            {currentOrders.map((order, index) => (
              <tr key={index} className='text-sm'>
                <td className="py-2 px-4 border border-gray-600">{index + 1 + (currentPage * ordersPerPage)}</td>
                <td className="py-2 px-4 border border-gray-600">{order.order_number}</td>
                <td className="py-2 px-4 border border-gray-600">{`${order.customer?.fname} ${order.customer?.lname}`}</td>
                <td className="py-2 px-4 border border-gray-600">{order.customer?.phone}</td>
                <td className="py-2 px-4 border border-gray-600">₹{order.totalAmount}</td>
                <td className="py-2 px-4 border border-gray-600"> {new Date(order.dateOfOrder).toLocaleDateString('en-GB')} </td>
                <td className="py-2 px-4 border border-gray-600">
                  {updateOrderId !== order._id ? <span className={`py-1 rounded-full px-3 text-xs ${order.status === 'cancelled' ? 'bg-red-500' :
                    order.status === 'booked' ? 'bg-green-500' :
                      order.status === 'new' ? 'bg-orange-400' :
                        ''
                    }`}>{order.status}</span> : <select
                      id={"status"}
                      name={"status"}
                      placeholder={"Select Status"}
                      // value={value}
                      onChange={({ target }) => setStatus(target.value)}
                      className="border px-4 py-2 w-48 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                    <option value={""} className="w-full dark:bg-gray-600 dark:text-white">Select Status</option>
                    <option value={"packaging"} className="w-full dark:bg-gray-600 dark:text-white">Packaging</option>
                    <option value={"shipped"} className="w-full dark:bg-gray-600 dark:text-white">Shipped</option>
                    <option value={"delivered"} className="w-full dark:bg-gray-600 dark:text-white">Delivered</option>
                    <option value={"returned"} className="w-full dark:bg-gray-600 dark:text-white">Returned</option>
                    <option value={"customer unavailable"} className="w-full dark:bg-gray-600 dark:text-white">Customer Unavailable</option>
                  </select>}
                </td>
                <td className="py-2 px-4 border border-gray-600">{`${order.weight || "0"}g`}</td>
                <td className="py-2 px-4 border border-gray-600">{order.payment_method}</td>
                <td className="py-2 px-4 border border-gray-600">{order.ordertype}</td>
                <td className="py-2 px-4 border border-gray-600">{updateOrderId != order._id ? order?.trackinglink ?
                  <Link to={order.trackinglink} target='_blank' className='text-blue-600 underline'>Track Order</Link>
                  : <Link to={"/all-orders"} className='text-blue-600 underline'>No Link</Link> :
                  <input
                    type="text"
                    id="serachtext"
                    value={trackinglink}
                    onChange={(e) => setTrackingLink(e.target.value)}
                    className="p-2 w-24 border rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
                  />
                }</td>
                <th className="py-2 px-4 border border-gray-600">
                  {updateOrderId != order._id ? <button className='w-fit bg-yellow-500 px-3 py-2 text-white rounded-md cursor-pointer' onClick={() => setUpdateOrderId(order._id)}>Update Status</button> :
                    <button onClick={handleSaveOrder} className='w-fit bg-green-500 px-3 py-2 text-white rounded-md cursor-pointer'>Save Order</button>}
                </th>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="w-full flex justify-end">
        <button
          onClick={() => exportToExcel(filterAndTransformOrders(), 'orders-excel')}
          className="text-white bg-green-600 p-2 mt-4 "
        >
          Download as Excel
        </button>
      </div>

    </div>
  );
};

export default AllOrders;
