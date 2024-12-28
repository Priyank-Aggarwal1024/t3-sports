import React from "react";

const OrderSummary = ({ selectedCustomer, products, shippingDetails }) => {
  const totalQuantity = products.reduce((sum, p) => sum + p.quantity, 0);
  const totalPrice = products.reduce((sum, p) => sum + p.price * p.quantity, 0);
  const shippingPrice = shippingDetails.shippingCharges
  const codPrice = shippingDetails.codCharges
  return (
    <div className="md:p-4 rounded-lg dark:text-white text-black">
      <h3 className="dark:text-[#e2e2e2] text-black text-3xl font-medium font-['Inter'] lg:pb-12 md:pb-8 pb-6">
        Order Summary
      </h3>

      <div className="flex flex-col gap-2">
        <div className="flex w-full dark:bg-black bg-white py-2 lg:px-8 px-4 text-center">
          <p className="dark:text-[#868686] text-black text-sm w-full">Product Image</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Name</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Price</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Colour</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Size</p>
          <p className="dark:text-[#868686] text-black text-sm w-full">Quantity</p>
        </div>
        {products.length > 0 ? products.map((product) => (
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
            </div>
          </div>
        )) :
          <div className="dark:text-[#e2e2e2] text-[#202020] md:text-xl text-lg md:py-6 py-4 font-normal font-['Inter'] w-full text-center">No Product Added</div>}
      </div>
      <div className="flex flex-col w-full items-end lg:pt-12 md:pt-8 pt-6">
        <div className="grid md:grid-cols-2 md:gap-5 gap-3 w-full">
          <div className="hidden md:block"></div>
          <div className="grid grid-cols-3 w-full">
            <div className=""></div>
            <div className="text-left dark:text-white text-black lg:text-2xl md:text-xl text-lg font-normal font-['Inter']">Total Price:</div>
            <div className="dark:text-white text-right text-black font-semibold lg:text-2xl md:text-xl text-lg font-['Inter']">₹ {totalPrice.toFixed(2)}</div>
          </div>
          <div className="hidden md:block"></div>
          <div className="grid grid-cols-3 w-full">
            <div className=""></div>
            <div className="text-left dark:text-white text-black lg:text-2xl md:text-xl text-lg font-normal font-['Inter']">Shipping:</div>
            <div className="dark:text-white text-right text-black font-semibold lg:text-2xl md:text-xl text-lg font-['Inter']">₹ {shippingPrice.toFixed(2)}</div>
          </div>
          <div className="hidden md:block"></div>
          <div className="grid grid-cols-3 w-full">
            <div className=""></div>
            <div className="text-left dark:text-white text-black lg:text-2xl md:text-xl text-lg font-normal font-['Inter']">COD Charges:</div>
            <div className="dark:text-white text-right text-black font-semibold lg:text-2xl md:text-xl text-lg font-['Inter']">₹ {codPrice.toFixed(2)}</div>
          </div>
          <div className="hidden md:block"></div>
          <div className="w-full dark:bg-[#868686] bg-black h-0.5"></div>
          <div className="hidden md:block"></div>
          <div className="w-full grid grid-cols-2">
            <div className="dark:text-white text-black lg:text-3xl text-left md:text-2xl text-xl font-normal font-['Inter']">Amount Payable:</div>
            <div className="dark:text-white text-right text-black  text-3xl font-semibold font-['Inter']">₹ {totalPrice + shippingPrice + codPrice}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderSummary;
