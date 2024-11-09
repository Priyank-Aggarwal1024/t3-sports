import React, { useState } from "react";
import axios from "axios";

const ProductForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    price: 0,
    quantity: 0,
    image: "",
    description: "",
    category: "",
    subcategory: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/products", formData);
      alert("Product created successfully");
    } catch (error) {
      console.error("Error creating product", error);
    }
  };

  return (
    <div className="flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-full rounded-md shadow-md"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">

        {/* Product Name */}
        <div>
          <label
            htmlFor="name"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Product Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            placeholder="Enter product name"
            value={formData.name}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Price */}
        <div>
          <label
            htmlFor="price"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            placeholder="Enter price"
            value={formData.price}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Quantity */}
        <div>
          <label
            htmlFor="quantity"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            name="quantity"
            placeholder="Enter quantity"
            value={formData.quantity}
            onChange={handleChange}
            required
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Image URL */}
        <div>
          <label
            htmlFor="image"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Image URL
          </label>
          <input
            type="text"
            id="image"
            name="image"
            placeholder="Enter image URL"
            value={formData.image}
            onChange={handleChange}
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Category
          </label>
          <input
            type="text"
            id="category"
            name="category"
            placeholder="Enter category"
            value={formData.category}
            onChange={handleChange}
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Subcategory */}
        <div>
          <label
            htmlFor="subcategory"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Subcategory
          </label>
          <input
            type="text"
            id="subcategory"
            name="subcategory"
            placeholder="Enter subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Description */}
        <div className="col-span-2">
          <label
            htmlFor="description"
            className="block text-gray-700 dark:text-gray-300 mb-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            placeholder="Enter product description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        </div>

        {/* Submit Button */}
        <button
          type="submit"
          className="w-full py-3 mt-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          Create Product
        </button>
      </form>
    </div>
  );
};

export default ProductForm;
