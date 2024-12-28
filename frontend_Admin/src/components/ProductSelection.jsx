import axios from "axios";
import React, { useEffect, useState } from "react";
import useProducts from "../contexts/useProducts";
import search from '../assets/search.svg'
import plus from '../assets/plus.svg'
const ProductSelection = ({ onProductSelect }) => {
  const { products } = useProducts();
  const [productSearch, setProductSearch] = useState("");
  const [filteredProducts, setFilteredProducts] = useState(products);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [quantities, setQuantities] = useState({}); // Track individual product quantities
  const [price, setPrice] = useState({}); // Track individual product quantities
  console.log(selectedProducts)
  const [select, setSelect] = useState(null);
  const handleQuantityChange = (productId, quantity) => {
    // Ensure quantities are updated individually for each product
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [productId]: quantity, // Update the quantity for the specific product
    }));
  };

  const handleSelectProduct = (product) => {
    const productQuantity = quantities[product._id] || 1; // Default quantity to 1 if not set
    const exists = selectedProducts.find((p) => p._id === product._id);
    const pr = price[product._id] || product.price;
    if (exists) {
      // If product is already selected, update its quantity
      setSelectedProducts((prev) =>
        prev.map((p) =>
          p._id === product._id ? { ...p, quantity: productQuantity, price: pr } : p
        )
      );
    } else {
      // Add new product to selectedProducts with the specified quantity
      setSelectedProducts((prev) => [
        ...prev,
        { ...product, quantity: productQuantity, price: pr },
      ]);
    }

    // Optionally, reset quantity input to 1 after adding the product
    setQuantities((prevQuantities) => ({
      ...prevQuantities,
      [product._id]: 1, // Reset to 1 for next selection
    }));
    setSelect(null);
    setProductSearch("");
  };
  const handleRemoveProduct = (product) => {
    setSelectedProducts(() => selectedProducts.filter((item) => item._id !== product._id))
  }
  useEffect(() => {
    if (productSearch.trim() !== "") {
      setFilteredProducts(() => products.filter((item) => {
        const regex = new RegExp(productSearch.trim().split("").join(".*"), "i");
        return regex.test(item.name) && selectedProducts.findIndex((prod) => prod._id == item._id) == -1;
      }))
    }
  }, [productSearch])
  console.log(filteredProducts);
  useEffect(() => {
    // Pass the selected products to the parent component (OrderForm)
    onProductSelect(selectedProducts);
  }, [selectedProducts, onProductSelect]);

  return (
    <div className="w-full">
      <div className="w-full flex md:items-center md:gap-6 gap-3 md:flex-row flex-col">
        <label htmlFor="productsearch" className="text-xl min-w-36 block font-semibold text-gray-800 dark:text-white">
          Select Products
        </label>
        <div className="w-full py-4 px-6 dark:bg-[#121212] bg-gray-300 rounded-[10px] flex justify-between dark:text-white text-black text-xl font-normal font-['Inter'] relative z-[1]">
          <div className="flex items-center gap-2.5 w-full ">
            <img src={search} alt="Search" />
            <input type="text" value={productSearch} onChange={({ target }) => setProductSearch(target.value)} name="productsearch" id="productsearch" placeholder="Search for products..." className="bg-transparent placeholder:dark:text-[#858585] placeholder:text-gray-700 outline-none border-none w-full" />
          </div>
          <button className="w-12 h-9 rounded-[5px] bg-[#2F60F3] flex items-center justify-center cursor-pointer disabled:bg-[#2f60f3cc] disabled:cursor-default"
            disabled={!select}
            onClick={() => handleSelectProduct(select)}
          >
            <img src={plus} alt="plus" />
          </button>
          {productSearch && <div className="absolute top-full mt-1 rounded-[10px] w-full z-[10] py-6 dark:bg-black bg-gray-300 shadow-xl dark:border left-0 px-4">
            <div className="flex flex-col gap-2 max-h-[40vh] overflow-y-auto">
              <div className="flex w-full dark:bg-[#121212] bg-white py-2 px-1 text-center">
                <p className="dark:text-white text-black text-sm w-full">Name</p>
                <p className="dark:text-white text-black text-sm w-full">Price</p>
                <p className="dark:text-white text-black text-sm w-full">Colour</p>
                <p className="dark:text-white text-black text-sm w-full">Size</p>
                <p className="dark:text-white text-black text-sm w-full">Quantity</p>
              </div>
              {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                product.quantity > 0 &&
                <div key={product._id} className={`py-2 px-1 border flex justify-between items-center w-full border-gray-600 rounded-md cursor-pointer dark:text-white text-black text-center hover:bg-[#2f60f3cc] ${select && select._id == product._id && "bg-[#2F60F3]"}`}
                  onClick={() => setSelect(product._id == select?._id ? null : product)}
                >
                  <h4 className="font-semibold text-lg w-full">{product.name}</h4>
                  <div className="flex items-center w-full justify-center gap-2">
                    <p className="">₹</p>
                    <input
                      type="number"
                      min="0"
                      value={price[product._id] || product.price} // Default value to 1
                      onChange={(e) => setPrice({ ...price, [product._id]: + e.target.value })}
                      className="block w-[64px] rounded-md p-1 pl-4 dark:bg-black bg-white shadow-sm border  dark:text-white text-black text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                  <p className="dark:text-white text-black text-sm w-full">{product.colour}</p>
                  <p className="dark:text-white text-black text-sm w-full">{product.size}</p>
                  <div className="flex items-center w-full justify-center gap-2">
                    <input
                      type="number"
                      min="1"
                      max={product.quantity}
                      value={quantities[product._id] || 1} // Default value to 1
                      onChange={(e) => handleQuantityChange(product._id, +e.target.value)}
                      className="block w-[64px] rounded-md p-1 pl-4 dark:bg-black bg-white shadow-sm border  dark:text-white text-black text-sm"
                      onClick={(e) => e.stopPropagation()}
                    />
                  </div>
                </div>
              )) :
                <div className="dark:text-[#e2e2e2] text-[#202020] text-xl py-3 font-normal font-['Inter'] w-full text-center">No Search Result found</div>
              }
            </div>
          </div>}
        </div>
      </div>

      <div className="flex flex-col gap-2 lg:mt-12 md:mt-6 mt-3">
        <div className="flex w-full dark:bg-black bg-white py-2 lg:px-8 px-4 text-center">
          <p className="dark:text-[#868686] text-black text-sm w-full">Product Image</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Name</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Price</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Colour</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Size</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Quantity</p>
        </div>
        {selectedProducts.length > 0 ? selectedProducts.map((product) => (
          <div key={product._id} className="lg:p-8 md:p-6 p-4 border flex justify-between items-center w-full border-gray-600 rounded-xl dark:bg-[#121212] bg-gray-300 dark:text-white text-black text-center">
            <div className="w-full flex items-center justify-center">
              <img className="w-24 h-18 rounded-lg" src={product.images[0]} alt={product.name} />
            </div>
            <h4 className="font-semibold w-full">{product.name}</h4>
            <p className="dark:text-white text-black text-sm w-full">₹{product.price.toFixed(2)}</p>
            <p className="dark:text-white text-black text-sm w-full">{product.colour}</p>
            <p className="dark:text-white text-black text-sm w-full">{product.size}</p>
            <div className="flex items-center justify-around dark:text-white text-black text-sm w-full">
              <div className="">{product.quantity}</div>
              <svg className="cursor-pointer" onClick={() => handleRemoveProduct(product)} xmlns="http://www.w3.org/2000/svg" width="21" height="22" viewBox="0 0 21 22" fill="none">
                <path d="M16.8704 16.3315C16.9314 16.3925 16.9798 16.4649 17.0128 16.5446C17.0458 16.6242 17.0627 16.7096 17.0627 16.7958C17.0627 16.8821 17.0458 16.9674 17.0128 17.0471C16.9798 17.1268 16.9314 17.1992 16.8704 17.2601C16.8095 17.3211 16.7371 17.3695 16.6574 17.4025C16.5777 17.4355 16.4924 17.4525 16.4061 17.4525C16.3199 17.4525 16.2345 17.4355 16.1549 17.4025C16.0752 17.3695 16.0028 17.3211 15.9418 17.2601L10.4999 11.8174L5.05792 17.2601C4.93478 17.3833 4.76777 17.4525 4.59363 17.4525C4.41948 17.4525 4.25247 17.3833 4.12933 17.2601C4.00619 17.137 3.93701 16.97 3.93701 16.7958C3.93701 16.6217 4.00619 16.4547 4.12933 16.3315L9.5721 10.8896L4.12933 5.44763C4.00619 5.32449 3.93701 5.15748 3.93701 4.98334C3.93701 4.80919 4.00619 4.64218 4.12933 4.51904C4.25247 4.3959 4.41948 4.32672 4.59363 4.32672C4.76777 4.32672 4.93478 4.3959 5.05792 4.51904L10.4999 9.96181L15.9418 4.51904C16.065 4.3959 16.232 4.32672 16.4061 4.32672C16.5803 4.32672 16.7473 4.3959 16.8704 4.51904C16.9936 4.64218 17.0627 4.80919 17.0627 4.98334C17.0627 5.15748 16.9936 5.32449 16.8704 5.44763L11.4276 10.8896L16.8704 16.3315Z" fill="#878787" />
              </svg>
            </div>
          </div>
        )) :
          <div className="dark:text-[#e2e2e2] text-[#202020] md:text-xl text-lg md:py-6 py-4 font-normal font-['Inter'] w-full text-center">No Product Added</div>}
      </div>
    </div>
  );
};

export default ProductSelection;
