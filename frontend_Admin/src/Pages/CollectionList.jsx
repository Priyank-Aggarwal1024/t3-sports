import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { IoMdClose, IoMdAdd } from "react-icons/io";
import useProducts from "../contexts/useProducts";

const CollectionList = () => {
  const { products } = useProducts();
  const [collections, setCollections] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState({});
  const [colloading, setColloading] = useState(false);
  const [open, setOpen] = useState({});
  const [adding, setAdding] = useState(false);
  const handleCollectionClick = (collection) => {
    if (open[collection._id]) {
      setOpen({ ...open, [collection._id]: false });
    } else {
      setOpen({ ...open, [collection._id]: true });
    }
  };
  useEffect(() => {
    const fetchCollections = async () => {
      setColloading(true);
      try {
        const response = await axios.get("/api/collections");
        setCollections(response.data.collections);
      } catch (error) {
        console.error("Error fetching collections", error);
      }
      setColloading(false);
    };

    fetchCollections();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this collection?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`/api/collections/${id}`);
        setCollections(
          collections.filter((collection) => collection._id !== id)
        );
        toast.success("Collection deleted successfully");
      } catch (error) {
        console.error("Error deleting collection:", error);
        toast.error("An error occurred while deleting the collection");
      }
    }
  };

  const handleAddProduct = async (collectionId) => {
    setAdding(true);
    if (!selectedProducts[collectionId]) return;
    try {
      await axios.put(`/api/collections/${collectionId}/add-product`, {
        productId: selectedProducts[collectionId],
      });
      const updatedCollections = collections.map((collection) =>
        collection._id === collectionId
          ? {
              ...collection,
              products: [
                ...collection.products,
                products.find(
                  (product) => product._id === selectedProducts[collectionId]
                ),
              ],
            }
          : collection
      );
      setCollections(updatedCollections);
      setSelectedProducts({ ...selectedProducts, [collectionId]: "" });
      toast.success("Product added to collection successfully");
    } catch (error) {
      console.error("Error adding product to collection:", error);
      toast.error("An error occurred while adding the product");
    }
    setAdding(false);
  };

  const handleRemoveProduct = async (collectionId, productId) => {
    try {
      await axios.put(`/api/collections/${collectionId}/remove-product`, {
        productId,
      });
      const updatedCollections = collections.map((collection) =>
        collection._id === collectionId
          ? {
              ...collection,
              products: collection.products.filter(
                (product) => product._id !== productId
              ),
            }
          : collection
      );
      setCollections(updatedCollections);
      toast.success("Product removed from collection successfully");
    } catch (error) {
      console.error("Error removing product from collection:", error);
      toast.error("An error occurred while removing the product");
    }
  };

  return (
    <div className="">
      <h2 className="text-3xl font-bold dark:text-white text-black mb-6">
        Our Collections
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-h-screen overflow-y-auto">
        {colloading ? (
          <div className="text-white text-xl">Loading...</div>
        ) : collections.length > 0 ? (
          collections.map((collection, ind) => (
            <div className="" key={ind}>
              <div
                key={collection._id}
                className="bg-white dark:bg-darkPrimary shadow-lg rounded-md md:p-9 sm:p-6 px-3 py-4 transition-transform transform w-full flex flex-col md:gap-9 gap-5"
              >
                <div
                  className="flex justify-between items-center cursor-pointer"
                  onClick={() => handleCollectionClick(collection)}
                >
                  <h3 className="text-xl font-semibold text-black dark:text-white ">
                    {collection.name}
                  </h3>
                  {open[collection._id] ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="13"
                      viewBox="0 0 16 13"
                      fill="none"
                    >
                      <path
                        d="M8.2771 0.64099L15.8859 12.5405L0.668299 12.5405L8.2771 0.64099Z"
                        fill="#D9D9D9"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="13"
                      viewBox="0 0 17 13"
                      fill="none"
                    >
                      <path
                        d="M8.34778 12.5387L0.282599 0.639223L16.413 0.639221L8.34778 12.5387Z"
                        fill="#D9D9D9"
                      />
                    </svg>
                  )}
                </div>
                <div className="overflow-x-auto w-full">
                  {open[collection._id] && (
                    <div className="min-w-[350px]">
                      <div className="my-4 flex gap-2">
                        <select
                          name={collection._id}
                          value={selectedProducts[collection._id] || ""}
                          onChange={(e) =>
                            setSelectedProducts((prev) => ({
                              ...prev,
                              [collection._id]: e.target.value,
                            }))
                          }
                          className="border rounded-md w-full text-sm pl-2 hover:cursor-pointer"
                        >
                          <option value="" disabled>
                            Select product to add
                          </option>
                          {products
                            .filter(
                              (product) =>
                                !collection.products.some(
                                  (wp) => wp._id === product._id
                                )
                            )
                            .map((product) => (
                              <option key={product._id} value={product._id}>
                                {product.name}
                              </option>
                            ))}
                        </select>
                        <button
                          onClick={() =>
                            !adding && handleAddProduct(collection._id)
                          }
                          className="bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition duration-200"
                          disabled={!selectedProducts[collection._id]}
                        >
                          <IoMdAdd />
                        </button>
                      </div>
                      <ul className="pb-3">
                        {collection.products.map((product) => (
                          <li
                            key={product._id}
                            className="flex  items-center md:mb-[18px] mb-3 "
                          >
                            <div className="flex justify-between items-center w-full p-2.5 dark:bg-black bg-white  rounded-[5px] shadow-sm">
                              <span className="font-medium text-black dark:text-white">
                                {product?.name}
                              </span>
                              <span className="text-[#2F60F3] font-semibold">
                                ${product?.price}
                              </span>
                            </div>
                            <button
                              onClick={() =>
                                handleRemoveProduct(collection._id, product._id)
                              }
                              className="dark:text-white text-black rounded-md py-1 pl-1 text-2xl cursor-pointer"
                            >
                              <IoMdClose />
                            </button>
                          </li>
                        ))}
                      </ul>

                      <div
                        className="text-[#df4f4f] text-center cursor-pointer text-[17px] font-medium font-['Inter']"
                        onClick={() => handleDelete(collection._id)}
                      >
                        Delete collection
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="dark:text-[#e2e2e2] text-black w-full lg:text-3xl md:text-2xl text-xl text-center font-normal md:pt-6 font-['Inter']">
            No collections found
          </div>
        )}
      </div>
    </div>
  );
};

export default CollectionList;
