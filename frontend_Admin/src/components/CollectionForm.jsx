import React, { useState, useEffect } from "react";
import axios from "axios";

const CollectionForm = () => {
  const [products, setProducts] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [selectedProducts, setSelectedProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products", error);
      }
    };

    fetchProducts();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/collections", {
        name: collectionName,
        productIds: selectedProducts,
      });
      alert("Collection created successfully");
    } catch (error) {
      console.error("Error creating collection", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-lg shadow-md lg:space-y-12 space-y-6"
      >
        <div>
          <label
            htmlFor="collectionName"
            className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
          >
            Collection Name
          </label>
          <input
            type="text"
            id="collectionName"
            placeholder="Enter collection name"
            value={collectionName}
            onChange={(e) => setCollectionName(e.target.value)}
            required
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Product Selection */}
        <div>
          <label
            htmlFor="products"
            className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
          >
            Select Products (hold Ctrl/Cmd to select multiple)
          </label>
          <select
            id="products"
            multiple
            onChange={(e) =>
              setSelectedProducts(
                [...e.target.selectedOptions].map((option) => option.value)
              )
            }
            className="w-full h-40 px-0 md:px-2 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            {products.map((product) => (
              <option
                className="hover:cursor-pointer hover:bg-gray-500 px-2 rounded-md"
                key={product._id}
                value={product._id}
              >
                {product.name}
              </option>
            ))}
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full md:py-3 py-2 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Collection
        </button>
      </form>
    </div>
  );
};

export default CollectionForm;
