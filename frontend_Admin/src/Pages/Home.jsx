// Home.jsx
import React, { useEffect, useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import CollectionList from "./CollectionList";
import Customer from "../components/Customer";
import useProducts from "../contexts/useProducts";
import WarehouseCard from "../components/WarehouseCard";
import Loader from "../components/Loader";
import { useOrders } from "../contexts/OrdersContext";
import search from '../assets/search.svg'
import axios from "axios";

const Home = () => {
  const {
    products,
    editingProduct,
    setEditingProduct,
    updatedProductData,
    setUpdatedProductData,
    handleDelete,
    handleEdit,
    handleUpdate,
  } = useProducts();

  const [searchText, setSearchText] = useState("");
  const { todayOrders, todayRevenue, aov } = useOrders();
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15); // Display 15 orders per page
  const [homeLoading, setHomeLoading] = useState(true);
  const totalPages = Math.ceil(products?.length / itemsPerPage);
  const changePage = (page) => {
    if (page < 0 || page >= totalPages) return; // Prevent going out of bounds
    setCurrentPage(page);
  };
  const regex = new RegExp(searchText, "i")
  const [fproducts, setFproducts] = useState(products);
  const [warehouses, setWarehouses] = useState([]);
  const [upq, setUpq] = useState(false);
  const getWarehouse = async () => {
    try {
      const response = await axios.get("/api/warehouses");
      setWarehouses([...response.data.warehouses]);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    }
  }
  useEffect(() => {
    if (warehouses && warehouses.length > 0) {
      const _products = (products?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage) || []).map((item) => ({
        ...item, quantity: warehouses.reduce((total, warehouse) => {
          const product = warehouse?.products?.find(p => p.productId._id === item._id);
          return product ? total + product.quantity : total;
        }, 0)
      }));
      setFproducts(_products);
    }
    return () => { }
  }, [products, warehouses])
  useEffect(() => {
    getWarehouse();
  }, [upq])
  useEffect(() => {
    getWarehouse();
    setTimeout(() => {
      setHomeLoading(false);
    }, 1000)
  }, [])
  return (
    <>
      {homeLoading ? <Loader /> :
        <div className="min-h-screen bg-gray-100 dark:bg-black">
          <div className="w-full lg:px-16 md:px-8 px-4 lg:py-14 py-8">
            <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-6">
              <div className="lg:px-8 md:py-6 md:px-6 p-4 cursor-pointer rounded-[20px] dark:bg-[#121212] bg-gray-300 shadow-md shadow-black dark:hover:bg-[#2F60F3] hover:bg-[#2F60F3] group">
                <div className="flex justify-between items-center">
                  <div className="dark:text-[#e2e2e2] text-black lg:text-xl text-lg font-medium font-['Inter']">Today’s Orders</div>
                  <div className="lg:w-12 lg:h-12 md:h-10 md:w-10 w-8 h-8 rounded-full bg-[#2F60F3] group-hover:bg-black flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" className="hidden group-hover:block">
                      <path d="M25.8892 8.89178V21.8918C25.8892 22.157 25.7838 22.4114 25.5963 22.5989C25.4087 22.7864 25.1544 22.8918 24.8892 22.8918C24.624 22.8918 24.3696 22.7864 24.1821 22.5989C23.9945 22.4114 23.8892 22.157 23.8892 21.8918V11.3055L9.59667 25.5993C9.40903 25.7869 9.15453 25.8923 8.88917 25.8923C8.6238 25.8923 8.36931 25.7869 8.18167 25.5993C7.99403 25.4116 7.88861 25.1571 7.88861 24.8918C7.88861 24.6264 7.99403 24.3719 8.18167 24.1843L22.4754 9.89178H11.8892C11.624 9.89178 11.3696 9.78643 11.1821 9.59889C10.9945 9.41135 10.8892 9.157 10.8892 8.89178C10.8892 8.62657 10.9945 8.37221 11.1821 8.18468C11.3696 7.99714 11.624 7.89178 11.8892 7.89178H24.8892C25.1544 7.89178 25.4087 7.99714 25.5963 8.18468C25.7838 8.37221 25.8892 8.62657 25.8892 8.89178Z" fill="white" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" className="group-hover:hidden" >
                      <path d="M25.8892 8.89178V21.8918C25.8892 22.157 25.7838 22.4114 25.5963 22.5989C25.4087 22.7864 25.1544 22.8918 24.8892 22.8918C24.624 22.8918 24.3696 22.7864 24.1821 22.5989C23.9945 22.4114 23.8892 22.157 23.8892 21.8918V11.3055L9.59667 25.5993C9.40903 25.7869 9.15453 25.8923 8.88917 25.8923C8.6238 25.8923 8.36931 25.7869 8.18167 25.5993C7.99403 25.4116 7.88861 25.1571 7.88861 24.8918C7.88861 24.6264 7.99403 24.3719 8.18167 24.1843L22.4754 9.89178H11.8892C11.624 9.89178 11.3696 9.78643 11.1821 9.59889C10.9945 9.41135 10.8892 9.157 10.8892 8.89178C10.8892 8.62657 10.9945 8.37221 11.1821 8.18468C11.3696 7.99714 11.624 7.89178 11.8892 7.89178H24.8892C25.1544 7.89178 25.4087 7.99714 25.5963 8.18468C25.7838 8.37221 25.8892 8.62657 25.8892 8.89178Z" fill="black" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6 w-full">
                  <div className="dark:text-[#e2e2e2] text-black xl:text-5xl lg:text-4xl text-3xl font-medium font-['Inter']">{Number(todayOrders).toLocaleString()}</div>
                  <div className="dark:text-[#e2e2e2] text-black pt-2.5 lg:text-[17px] text-[14px] font-normal font-['Inter']">New orders</div>
                </div>
              </div>
              <div className="lg:px-8 md:py-6 md:px-6 p-4 cursor-pointer rounded-[20px] dark:bg-[#121212] bg-gray-300 shadow-md shadow-black dark:hover:bg-[#2F60F3] hover:bg-[#2F60F3] group">
                <div className="flex justify-between items-center">
                  <div className="dark:text-[#e2e2e2] text-black lg:text-xl text-lg font-medium font-['Inter']">Today’s Revenue</div>
                  <div className="lg:w-12 lg:h-12 md:h-10 md:w-10 w-8 h-8 rounded-full bg-[#2F60F3] group-hover:bg-black flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" className="hidden group-hover:block">
                      <path d="M25.8892 8.89178V21.8918C25.8892 22.157 25.7838 22.4114 25.5963 22.5989C25.4087 22.7864 25.1544 22.8918 24.8892 22.8918C24.624 22.8918 24.3696 22.7864 24.1821 22.5989C23.9945 22.4114 23.8892 22.157 23.8892 21.8918V11.3055L9.59667 25.5993C9.40903 25.7869 9.15453 25.8923 8.88917 25.8923C8.6238 25.8923 8.36931 25.7869 8.18167 25.5993C7.99403 25.4116 7.88861 25.1571 7.88861 24.8918C7.88861 24.6264 7.99403 24.3719 8.18167 24.1843L22.4754 9.89178H11.8892C11.624 9.89178 11.3696 9.78643 11.1821 9.59889C10.9945 9.41135 10.8892 9.157 10.8892 8.89178C10.8892 8.62657 10.9945 8.37221 11.1821 8.18468C11.3696 7.99714 11.624 7.89178 11.8892 7.89178H24.8892C25.1544 7.89178 25.4087 7.99714 25.5963 8.18468C25.7838 8.37221 25.8892 8.62657 25.8892 8.89178Z" fill="white" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" className="group-hover:hidden" >
                      <path d="M25.8892 8.89178V21.8918C25.8892 22.157 25.7838 22.4114 25.5963 22.5989C25.4087 22.7864 25.1544 22.8918 24.8892 22.8918C24.624 22.8918 24.3696 22.7864 24.1821 22.5989C23.9945 22.4114 23.8892 22.157 23.8892 21.8918V11.3055L9.59667 25.5993C9.40903 25.7869 9.15453 25.8923 8.88917 25.8923C8.6238 25.8923 8.36931 25.7869 8.18167 25.5993C7.99403 25.4116 7.88861 25.1571 7.88861 24.8918C7.88861 24.6264 7.99403 24.3719 8.18167 24.1843L22.4754 9.89178H11.8892C11.624 9.89178 11.3696 9.78643 11.1821 9.59889C10.9945 9.41135 10.8892 9.157 10.8892 8.89178C10.8892 8.62657 10.9945 8.37221 11.1821 8.18468C11.3696 7.99714 11.624 7.89178 11.8892 7.89178H24.8892C25.1544 7.89178 25.4087 7.99714 25.5963 8.18468C25.7838 8.37221 25.8892 8.62657 25.8892 8.89178Z" fill="black" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6 w-full">
                  <div className="dark:text-[#e2e2e2] text-black xl:text-5xl lg:text-4xl text-3xl font-medium font-['Inter']">₹ {Number(todayRevenue).toLocaleString()}</div>
                  <div className="dark:text-[#e2e2e2] text-black pt-2.5 lg:text-[17px] text-[14px] font-normal font-['Inter']">View Net profit</div>
                </div>
              </div>
              <div className="lg:px-8 md:py-6 md:px-6 p-4 cursor-pointer rounded-[20px] dark:bg-[#121212] bg-gray-300 shadow-md shadow-black dark:hover:bg-[#2F60F3] hover:bg-[#2F60F3] group">
                <div className="flex justify-between items-center">
                  <div className="dark:text-[#e2e2e2] text-black lg:text-xl text-lg font-medium font-['Inter']">Average Order Value</div>
                  <div className="lg:w-12 lg:h-12 md:h-10 md:w-10 w-8 h-8 rounded-full bg-[#2F60F3] group-hover:bg-black flex justify-center items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" className="hidden group-hover:block">
                      <path d="M25.8892 8.89178V21.8918C25.8892 22.157 25.7838 22.4114 25.5963 22.5989C25.4087 22.7864 25.1544 22.8918 24.8892 22.8918C24.624 22.8918 24.3696 22.7864 24.1821 22.5989C23.9945 22.4114 23.8892 22.157 23.8892 21.8918V11.3055L9.59667 25.5993C9.40903 25.7869 9.15453 25.8923 8.88917 25.8923C8.6238 25.8923 8.36931 25.7869 8.18167 25.5993C7.99403 25.4116 7.88861 25.1571 7.88861 24.8918C7.88861 24.6264 7.99403 24.3719 8.18167 24.1843L22.4754 9.89178H11.8892C11.624 9.89178 11.3696 9.78643 11.1821 9.59889C10.9945 9.41135 10.8892 9.157 10.8892 8.89178C10.8892 8.62657 10.9945 8.37221 11.1821 8.18468C11.3696 7.99714 11.624 7.89178 11.8892 7.89178H24.8892C25.1544 7.89178 25.4087 7.99714 25.5963 8.18468C25.7838 8.37221 25.8892 8.62657 25.8892 8.89178Z" fill="white" />
                    </svg>
                    <svg xmlns="http://www.w3.org/2000/svg" width="33" height="33" viewBox="0 0 33 33" fill="none" className="group-hover:hidden" >
                      <path d="M25.8892 8.89178V21.8918C25.8892 22.157 25.7838 22.4114 25.5963 22.5989C25.4087 22.7864 25.1544 22.8918 24.8892 22.8918C24.624 22.8918 24.3696 22.7864 24.1821 22.5989C23.9945 22.4114 23.8892 22.157 23.8892 21.8918V11.3055L9.59667 25.5993C9.40903 25.7869 9.15453 25.8923 8.88917 25.8923C8.6238 25.8923 8.36931 25.7869 8.18167 25.5993C7.99403 25.4116 7.88861 25.1571 7.88861 24.8918C7.88861 24.6264 7.99403 24.3719 8.18167 24.1843L22.4754 9.89178H11.8892C11.624 9.89178 11.3696 9.78643 11.1821 9.59889C10.9945 9.41135 10.8892 9.157 10.8892 8.89178C10.8892 8.62657 10.9945 8.37221 11.1821 8.18468C11.3696 7.99714 11.624 7.89178 11.8892 7.89178H24.8892C25.1544 7.89178 25.4087 7.99714 25.5963 8.18468C25.7838 8.37221 25.8892 8.62657 25.8892 8.89178Z" fill="black" />
                    </svg>
                  </div>
                </div>
                <div className="pt-6 w-full">
                  <div className="dark:text-[#e2e2e2] text-black xl:text-5xl lg:text-4xl text-3xl font-medium font-['Inter']">₹ {Number(aov.toFixed(2)).toLocaleString()}</div>
                  <div className="dark:text-[#e2e2e2] text-black pt-2.5 lg:text-[17px] text-[14px] font-normal font-['Inter']">This week</div>
                </div>
              </div>
            </div>
          </div>
          <div className="w-full lg:px-16 md:px-8 px-4 py-10">

            <div className="mb-4 flex justify-center w-full">
              <div className="w-full py-4 px-6 dark:bg-[#121212] bg-gray-300 rounded-[10px] flex justify-between dark:text-white text-black text-xl font-normal font-['Inter'] relative z-[1]">
                <div className="flex items-center gap-2.5 w-full ">
                  <img src={search} alt="Search" />
                  <input type="text" value={searchText} onChange={(e) => setSearchText(e.target.value)}
                    name="search" id="search" placeholder="Search by Product Name" className="bg-transparent placeholder:dark:text-[#858585] placeholder:text-gray-700 outline-none border-none w-full" />
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-darkPrimary rounded-md shadow-md p-6 mb-12">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-medium text-black dark:text-white">All Products</h3>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => changePage(currentPage - 1)}
                    disabled={currentPage === 0}
                    className="py-1 px-2 bg-[#2F60F3] text-white rounded-md disabled:bg-gray-600"
                  >
                    <IoIosArrowBack className="" />
                  </button>
                  <button
                    onClick={() => changePage(currentPage + 1)}
                    disabled={currentPage === totalPages - 1}
                    className="py-1 px-2 bg-[#2F60F3] text-white rounded-md disabled:bg-gray-600"
                  >
                    <IoIosArrowForward className="" />
                  </button>
                </div>
              </div>

              <div className="block w-full overflow-x-auto">
                {fproducts.length === 0 ? (
                  <p className="text-center text-black dark:text-white">No Products found.</p>
                ) : (
                  <table className="items-center bg-transparent w-full border-collapse">
                    <thead>
                      <tr>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Serial No.
                        </th>

                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Quantity
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Product Name
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Image
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">

                          Price
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Size - Colour
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Category
                        </th>
                        <th className="px-4 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                          Action
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {fproducts.map((product, index) => regex.test(product.name) && (
                        <tr key={product._id} className="border border-gray-700 text-black dark:text-white">
                          <td className="px-4 py-1 text-sm">{index + 1 + (currentPage * itemsPerPage)}</td>
                          <td className="px-4 py-1 text-sm border border-gray-600">
                            {product?.quantity} Units
                          </td>

                          <td className="px-4 py-1 text-sm border border-gray-600">
                            {editingProduct?._id === product._id ? (
                              <input
                                type="text"
                                className="bg-gray-400 rounded-md px-3 py-1 text-black block w-full"
                                value={updatedProductData.name}
                                onChange={(e) =>
                                  setUpdatedProductData({ ...updatedProductData, name: e.target.value })
                                }
                              />
                            ) : (
                              product.name
                            )}
                          </td>
                          <td className="px-4 py-1 text-sm border border-gray-600">
                            <img src={product.images[0]} alt={product.name} className="w-14 h-14" />
                          </td>
                          <td className="px-4 py-1 text-sm border border-gray-600">
                            {editingProduct?._id === product._id ? (
                              <input
                                type="number"
                                min={0}
                                className="bg-gray-400 rounded-md px-3 py-1 text-black block w-full"
                                value={updatedProductData.price}
                                onChange={(e) =>
                                  setUpdatedProductData({ ...updatedProductData, price: e.target.value })
                                }
                              />
                            ) : (
                              `₹${product.price}`
                            )}
                          </td>
                          <td className="px-4 py-1 text-sm border border-gray-600">
                            {editingProduct?._id === product._id ? (
                              <input
                                type="text"
                                className="bg-gray-400 rounded-md px-3 py-1 text-black block w-full"
                                value={updatedProductData.size}
                                onChange={(e) =>
                                  setUpdatedProductData({ ...updatedProductData, size: e.target.value })
                                }
                              />
                            ) : (
                              product.size
                            )}
                          </td>
                          <td className="px-4 py-1 text-sm border border-gray-600">
                            {editingProduct?._id === product._id ? (
                              <input
                                type="text"
                                className="bg-gray-400 rounded-md px-3 py-1 text-black block w-full"
                                value={updatedProductData.category}
                                onChange={(e) =>
                                  setUpdatedProductData({ ...updatedProductData, category: e.target.value })
                                }
                              />
                            ) : (
                              product.category
                            )}
                          </td>
                          <td className="px-4 py-1 text-sm border border-gray-600">
                            {editingProduct?._id === product._id ? (
                              <div className="flex gap-2 items-center">
                                <button className="flex gap-2 bg-green-400 items-center py-1 px-3 rounded-md text-black" onClick={() => handleUpdate(product._id)}>Save</button>
                                <button className="flex gap-2 bg-red-500 items-center py-1 px-3 rounded-md text-black" onClick={() => setEditingProduct(null)}>Cancel</button>
                              </div>
                            ) : (
                              <div className="flex gap-2 items-center">
                                <button className="flex gap-2 bg-orange-400 items-center py-1 px-3 rounded-md text-black" onClick={() => handleEdit(product)}>
                                  <FaEdit /> Edit
                                </button>
                                <button className="flex gap-2 bg-red-500 items-center py-1 px-3 rounded-md text-black" onClick={() => handleDelete(product._id)}>
                                  <RiDeleteBin5Fill /> Delete
                                </button>
                              </div>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>
          <div className="w-full lg:px-16 md:px-8 px-4 lg:py-14 py-8">
            <WarehouseCard setUpq={setUpq} upq={upq} />
            <CollectionList />
            <Customer />
          </div>
        </div>}
    </>

  );
};

export default Home;
