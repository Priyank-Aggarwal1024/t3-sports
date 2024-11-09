import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductForm from "../components/ProductForm";
import CollectionForm from "../components/CollectionForm";

const ProductList = () => {


  return (
    <div className="min-h-screen bg-gray-100 dark:bg-black p-6">
      <div className="">
        {/* Page Heading */}
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-8">
          Product & Collection Management
        </h2>

        {/* Forms Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Product Form */}
          <div className="bg-lightPrimary dark:bg-darkPrimary rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-medium text-gray-800 dark:text-white">
              Create New Product
            </h3>
            <hr className="my-4 opacity-50" />
            <ProductForm />
          </div>

          {/* Collection Form */}
          <div className="bg-lightPrimary dark:bg-darkPrimary rounded-lg shadow-md p-6">
            <h3 className="text-2xl font-medium text-gray-800 dark:text-white">
              Create New Collection
            </h3>
            <hr className="my-4 opacity-50" />
            <CollectionForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductList;
