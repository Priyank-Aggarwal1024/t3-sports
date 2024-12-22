import React, { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { MdDelete } from "react-icons/md";
import { IoMdClose, IoMdAdd } from "react-icons/io";


const CollectionList = () => {
  const [collections, setCollections] = useState([]);
  const [availableProducts, setAvailableProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [colloading, setColloading] = useState(false)
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

    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setAvailableProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchCollections();
    fetchProducts();
  }, []);

  const handleDelete = async (id) => {
    const isConfirmed = window.confirm(
      "Are you sure you want to delete this collection?"
    );
    if (isConfirmed) {
      try {
        await axios.delete(`/api/collections/${id}`);
        setCollections(collections.filter((collection) => collection._id !== id));
        toast.success("Collection deleted successfully");
      } catch (error) {
        console.error("Error deleting collection:", error);
        toast.error("An error occurred while deleting the collection");
      }
    }
  };

  const handleAddProduct = async (collectionId) => {
    if (!selectedProductId) return;
    try {
      await axios.put(`/api/collections/${collectionId}/add-product`, { productId: selectedProductId });
      const updatedCollections = collections.map((collection) =>
        collection._id === collectionId
          ? { ...collection, products: [...collection.products, availableProducts.find(product => product._id === selectedProductId)] }
          : collection
      );
      setCollections(updatedCollections);
      toast.success("Product added to collection successfully");
      setSelectedProductId(null); // Reset the selected product after adding
    } catch (error) {
      console.error("Error adding product to collection:", error);
      toast.error("An error occurred while adding the product");
    }
  };

  const handleRemoveProduct = async (collectionId, productId) => {
    try {
      await axios.put(`/api/collections/${collectionId}/remove-product`, { productId });
      const updatedCollections = collections.map((collection) =>
        collection._id === collectionId
          ? { ...collection, products: collection.products.filter(product => product._id !== productId) }
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
      <h2 className="text-3xl font-bold dark:text-white text-black mb-6">Our Collections</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {colloading ? <div className="text-white text-xl">Loading...</div> : collections.map((collection) => (
          <div
            key={collection._id}
            className="bg-white dark:bg-darkPrimary shadow-lg rounded-md p-6 transition-transform transform hover:scale-105"
          >
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-4">{collection.name}</h3>
              <button
                onClick={() => handleDelete(collection._id)}
                className="bg-red-600 hover:bg-red-700 text-white rounded-md py-2 px-4 transition duration-200"
              >
                <MdDelete />
              </button>
            </div>
            <hr className="my-8" />
            <ul className="space-y-3">
              {collection.products.map((product) => (
                <li key={product._id} className="flex justify-between items-center">
                  <span className="font-medium text-black dark:text-white">{product.name}</span>
                  <span className="text-primary font-semibold">${product.price}</span>
                  <button
                    onClick={() => handleRemoveProduct(collection._id, product._id)}
                    className="bg-red-500 hover:bg-red-600 text-white rounded-md py-1 px-2 ml-4"
                  >
                    <IoMdClose />
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-4 flex gap-2">
              <select
                value={selectedProductId || ""}
                onChange={(e) => setSelectedProductId(e.target.value)}
                className="border rounded-md w-full text-sm pl-2 hover:cursor-pointer"
              >
                <option value="" disabled>
                  Select product to add
                </option>
                {availableProducts.map((product) => (
                  <option key={product._id} value={product._id}>
                    {product.name}
                  </option>
                ))}
              </select>
              <button
                onClick={() => handleAddProduct(collection._id)}
                className=" bg-blue-500 hover:bg-blue-600 text-white rounded-md py-2 px-4 transition duration-200"
              >
                <IoMdAdd />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CollectionList;
