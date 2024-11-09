// Home.jsx
import React, { useState } from "react";
import { IoIosArrowBack, IoIosArrowForward } from "react-icons/io";
import { RiDeleteBin5Fill } from "react-icons/ri";
import { FaEdit } from "react-icons/fa";
import CollectionList from "./CollectionList";
import Customer from "../components/Customer";
import useProducts from "../contexts/useProducts";

const Home = () => {
  const {
    products,
    filterProducts,
    editingProduct,
    setEditingProduct,
    updatedProductData,
    setUpdatedProductData,
    handleDelete,
    handleEdit,
    handleUpdate,
  } = useProducts();

  const [searchText, setSearchText] = useState("");
  // Pagination State
  const [currentPage, setCurrentPage] = useState(0);
  const [itemsPerPage] = useState(15); // Display 15 orders per page

  // Calculate total number of pages
  const totalPages = Math.ceil(products?.length / itemsPerPage);

  // Function to change the page
  const changePage = (page) => {
    if (page < 0 || page >= totalPages) return; // Prevent going out of bounds
    setCurrentPage(page);
  };

  // Slice orders for the current page
  const currentProducts = products?.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <div className="mx-auto">
        <div className="mb-4 flex justify-center w-full">
          <input
            type="text"
            name="search"
            id="search"
            className="w-full sm:w-1/2 border rounded-md p-2 bg-white dark:bg-transparent placeholder:text-sm text-sm pl-4 dark:text-white dark:border-gray-600 text-black"
            placeholder="Search by Product Name"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
          />
        </div>

        <div className="bg-white dark:bg-darkPrimary rounded-md shadow-md p-6 mb-12">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-2xl font-medium text-black dark:text-white">All Products</h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => changePage(currentPage - 1)}
                disabled={currentPage === 0}
                className="py-1 px-2 bg-primary text-white rounded-md disabled:bg-gray-600"
              >
                <IoIosArrowBack className="" />
              </button>
              <button
                onClick={() => changePage(currentPage + 1)}
                disabled={currentPage === totalPages - 1}
                className="py-1 px-2 bg-primary text-white rounded-md disabled:bg-gray-600"
              >
                <IoIosArrowForward className="" />
              </button>
            </div>
          </div>

          <div className="block w-full overflow-x-auto">
            {currentProducts.length === 0 ? (
              <p className="text-center text-black dark:text-white">No Products found.</p>
            ) : (
              <table className="items-center bg-transparent w-full border-collapse">
                <thead>
                  <tr>
                    <th className="px-6 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                      Serial No.
                    </th>
                    <th className="px-6 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                      Quantity
                    </th>
                    <th className="px-6 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                      Product Name
                    </th>
                    <th className="px-6 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                      Price
                    </th>
                    <th className="px-6 bg-gray-100 dark:bg-black text-gray-800 dark:text-gray-200 align-middle border border-solid border-gray-200 dark:border-gray-700 py-3 text-xs uppercase whitespace-nowrap font-semibold text-left">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {currentProducts.map((product, index) => (
                    <tr key={product._id} className="border border-gray-700 text-white">
                      <td className="px-4 py-1 text-sm">{index + 1 + (currentPage * itemsPerPage)}</td>
                      <td className="px-4 py-1 text-sm border border-gray-600">
                        {editingProduct?._id === product._id ? (
                          <input
                            type="number"
                            className="bg-gray-300 px-3 py-1 text-black"
                            value={updatedProductData.quantity}
                            onChange={(e) =>
                              setUpdatedProductData({ ...updatedProductData, quantity: e.target.value })
                            }
                          />
                        ) : (
                          `${product.quantity} Units`
                        )}
                      </td>
                      <td className="px-4 py-1 text-sm border border-gray-600">
                        {editingProduct?._id === product._id ? (
                          <input
                            type="text"
                            className="bg-gray-300 px-3 py-1 text-black"
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
                        {editingProduct?._id === product._id ? (
                          <input
                            type="number"
                            className="bg-gray-300 px-3 py-1 text-black"
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
      <CollectionList />
      <Customer />
    </div>
  );
};

export default Home;
