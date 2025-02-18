import React, { useState } from "react";
import useProducts from "../contexts/useProducts";
import useWarehouse from "../contexts/useWarehouse";
const initialWarehouseState = {
  name: "",
  address: "",
  email: "",
  products: [],
};
const errorWarehouseState = {
  name: "",
  address: "",
  email: "",
};
function CreateWarehouse(props) {
  const [data, setData] = useState(initialWarehouseState);
  const { products, ploading } = useProducts();
  const { createWarehouse, warehouse } = useWarehouse();
  const [loading, setLoading] = useState(false);
  const [messageWarehouse, setMessageWarehouse] = useState(errorWarehouseState);
  const [quantity, setQuantity] = useState({});

  const handleChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
    setMessageWarehouse({ ...messageWarehouse, [e.target.name]: "" });
  };
  const handleAddProduct = (id) => {
    const _products = [...data.products, { productId: id }];
    setData({ ...data, products: _products });
  };
  const handleRemoveProduct = (id) => {
    const _products = data.products.filter((item) => item.productId != id);
    setData({ ...data, products: _products });
  };
  const handleQuantityChange = (productId, quantity) => {
    setQuantity((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity,
    }));
  };

  const handleSubmit = async (e) => {
    setMessageWarehouse(errorWarehouseState);
    e.preventDefault();
    if (!data.email || data.email.trim() == "") {
      setMessageWarehouse({
        ...errorWarehouseState,
        email: "Warehouse email is required.",
      });
      return;
    }
    if (!data.name || data.name.trim() == "") {
      setMessageWarehouse({
        ...errorWarehouseState,
        name: "Warehouse name is required.",
      });
      return;
    }
    if (!data.address || data.address.trim() == "") {
      setMessageWarehouse({
        ...errorWarehouseState,
        address: "Warehouse address is required.",
      });
      return;
    }
    const _products = data.products.map((item) => ({
      ...item,
      quantity: quantity[item.productId] || 0,
    }));
    const createwdata = { ...data, products: _products };
    setData({ ...data, products: _products });
    setLoading(true);
    await createWarehouse(createwdata);
    setLoading(false);
    setData(initialWarehouseState);
  };
  return (
    <form className="w-full block">
      <div className="grid md:grid-cols-2 gap-12 dark:bg-darkPrimary rounded-lg">
        <div className="w-full flex flex-col lg:gap-12 gap-6">
          <div className="w-full">
            <label
              htmlFor="email"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Warehouse Email
            </label>
            <input
              type="text"
              id="email"
              name="email"
              placeholder="Enter warehouse email"
              value={data.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {messageWarehouse.email && (
              <p className="text-red-500 text-[12px] pt-1 pl-1">
                {messageWarehouse.email}
              </p>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="name"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Warehouse Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Enter warehouse name"
              value={data.name}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {messageWarehouse.name && (
              <p className="text-red-500 text-[12px] pt-1 pl-1">
                {messageWarehouse.name}
              </p>
            )}
          </div>
          <div className="w-full">
            <label
              htmlFor="address"
              className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-2"
            >
              Warehouse Address
            </label>
            <input
              type="text"
              id="address"
              name="address"
              placeholder="Enter warehouse address"
              value={data.address}
              onChange={handleChange}
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            {messageWarehouse.address && (
              <p className="text-red-500 text-[12px] pt-1 pl-1">
                {messageWarehouse.address}
              </p>
            )}
          </div>
        </div>
        <div className="w-full flex flex-col dark:bg-black bg-white rounded gap-2 text-balck dark:text-white p-4">
          <div className="w-full rounded-md  py-2 px-4 flex items-center justify-between">
            <span className="w-full text-center">Name</span>
            <span className="w-full text-center">Photo</span>
            <span className="w-full text-center">Size</span>
            <span className="w-full text-center">Quantity</span>
            <span className="w-full text-center">Action</span>
          </div>
          {ploading ? (
            <span>Loading...</span>
          ) : products.length > 0 ? (
            products.map((prod, index) => (
              <div
                className="w-full border-white rounded-md border py-2 px-4 bg-neutral-100 dark:bg-darkPrimary flex items-center justify-between"
                key={index}
              >
                <span className="w-full text-center"> {prod.name}</span>
                <div className="w-full text-center flex justify-center">
                  <img
                    className="w-12 h-12 rounded-md "
                    src={prod.images[0]}
                    alt="product image"
                  />
                </div>
                <span className="w-full text-center"> {prod.size}</span>
                <div className="flex items-center w-full justify-center gap-2">
                  <input
                    type="number"
                    min="0"
                    value={quantity[prod._id] || "0"} // Default value to 1
                    onChange={(e) =>
                      handleQuantityChange(prod._id, +e.target.value)
                    }
                    className="block w-[64px] rounded-md p-1 pl-4 dark:bg-black bg-white shadow-sm border  dark:text-white text-black text-sm"
                    onClick={(e) => e.stopPropagation()}
                  />
                </div>
                {data.products.findIndex((it) => it.productId == prod._id) !=
                -1 ? (
                  <span
                    className="flex items-center justify-center w-full text-center h-full bg-red-500 px-4 py-2 rounded-lg cursor-pointer "
                    onClick={() => handleRemoveProduct(prod._id)}
                  >
                    Remove
                  </span>
                ) : (
                  <span
                    className="flex items-center justify-center w-full text-center h-full bg-green-500 px-4 py-2 rounded-lg cursor-pointer "
                    onClick={() => handleAddProduct(prod._id)}
                  >
                    Add
                  </span>
                )}
              </div>
            ))
          ) : (
            <div className="">No Products Found</div>
          )}
        </div>
        <div
          className="w-full md:col-span-2 flex items-center justify-center gap-4  rounded-md bg-[#2F60F3] cursor-pointer py-3 px-4 text-center text-white font-bold text-md uppercase"
          onClick={handleSubmit}
        >
          {loading && <span className="loader"></span>}
          <span>Create Warehouse</span>
        </div>
      </div>
    </form>
  );
}

export default CreateWarehouse;
