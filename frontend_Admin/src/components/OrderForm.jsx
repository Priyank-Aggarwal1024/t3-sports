import React, { useState } from "react";
import axios from "axios";
import CustomerSearch from "./CustomerSearch";
import ProductSelection from "./ProductSelection";
import OrderSummary from "./OrderSummary";
import ShippingDetails from "./ShippingDetails";
import PaymentStatus from "./PaymentStatus";
import WarehouseSearch from "./WarehouseSearch";
import OrderType from "./OrderType";

const OrderForm = () => {
  const [products, setProducts] = useState([]);
  const [orderDetails, setOrderDetails] = useState({
    shippingCharges: 0,
    codCharges: 0,
    taxAmount: 0,
    discount: 0,
    payment_method: "",
    otherpayment_status: "",
    note: "",
    payment_status: "",
    insuranceRequired: false,
    shipping_type: "",
    platform: "",
    other_platform: ""
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    shippingAddress: {
      address: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    shippingCharges: 0,
    codCharges: 0,
  });
  const [validtionMessage, setValidationMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const handleProductSelect = (selectedProducts) => {
    setProducts(selectedProducts);
  };
  const handleShippingDetailsChange = (details) => {
    setShippingDetails(details);
    setOrderDetails((prev) => ({
      ...prev,
      shippingCharges: details.shippingCharges,
      codCharges: details.codCharges,
    }));
  };

  const handleOrderDetailChange = (name, value) => {
    setOrderDetails((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleInsuranceChange = (e) => {
    setOrderDetails((prev) => ({
      ...prev,
      insuranceRequired: !orderDetails.insuranceRequired,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setValidationMessage("");
    if (!selectedWarehouse) {
      setValidationMessage("Please select a warehouse before submitting the order.");
      return;
    }
    if (!orderDetails.payment_method || orderDetails.payment_method.trim() == "") {
      setValidationMessage("Order type should be valid ");
      return;
    }
    if (!orderDetails.payment_status) {
      setValidationMessage("Please select a payment method before submitting the order.")
      return;
    }
    if (orderDetails.payment_status == "others" && orderDetails.otherpayment_status.trim() == "") {
      setValidationMessage("Give the comment on payment method before submitting the order.")
      return;
    }
    if (!selectedCustomer) {
      setValidationMessage("Please select a customer before submitting the order.");
      return;
    }
    if (!products || products.length == 0) {
      setValidationMessage("Please add atleast one product in your order.");
      return;
    }
    if (!shippingDetails.shippingAddress.country || shippingDetails.shippingAddress.country.trim() == "") {
      setValidationMessage("Enter your country.");
      return;
    }
    if (orderDetails.shipping_type.trim() === "") {
      setValidationMessage("Type of shipping should be valid.");
      return;
    }
    if (orderDetails.platform.trim() === "") {
      setValidationMessage("Platform should be valid.");
      return;
    }
    if (orderDetails.platform === "others" && orderDetails.other_platform.trim() === "") {
      setValidationMessage("Give Other Shipping Platform note.");
      return;
    }

    // Calculate the total amount from products
    const totalAmount = products.reduce((total, product) => {
      return total + product.price * product.quantity;
    }, 0);

    // Add shipping charges and COD charges if applicable
    const finalAmount =
      totalAmount +
      (shippingDetails.shippingCharges || 0) +
      (shippingDetails.codCharges || 0) +
      (orderDetails.taxAmount || 0) -
      (orderDetails.discount || 0);

    const orderData = {
      warehouse_id: selectedWarehouse._id,
      order_number: Date.now().toString(), // Generate a unique order number
      customer: selectedCustomer._id,
      payment_status: orderDetails.payment_status,
      otherpayment_status: orderDetails.otherpayment_status,
      note: orderDetails.note,
      payment_method: orderDetails.payment_method,
      amount: finalAmount.toString(), // Convert to string as per schema
      products: products.map((p) => ({
        _id: p._id,
        productName: p.name,
        quantity: p.quantity,
        price: p.price,
        nimbusprice: p.nimbusprice
      })),
      shippingDetails: {
        shippingAddress:
        {
          address: shippingDetails.shippingAddress.address,
          city: shippingDetails.shippingAddress.city,
          state: shippingDetails.shippingAddress.state,
          pincode: shippingDetails.shippingAddress.pincode,
          country: shippingDetails.shippingAddress.country,
        },
        shippingCharges: shippingDetails.shippingCharges || 0,
        codCharges: shippingDetails.codCharges || 0,
      },
      taxAmount: orderDetails.taxAmount || 0,
      discount: orderDetails.discount || 0,
      totalAmount: finalAmount,
      insuranceRequired: orderDetails.insuranceRequired,
      shipping_type: orderDetails.shipping_type,
      platform: orderDetails.platform,
      other_platform: orderDetails.other_platform
    };


    const confirmSubmission = window.confirm(
      "Are you sure you want to assign this order?"
    );
    if (!confirmSubmission) return;
    try {
      const response = await axios.post("/api/orders/create", orderData);
      alert(
        "Order assigned successfully "
        // response.data.order_id
      );
      window.location.reload();
      // Optionally reset the form or redirect
    } catch (error) {
      console.error("Error creating order:", error.response?.data || error.message);
      alert(error.response?.data?.message || "Error creating order");
    }
  };

  return (
    <div className="dark:bg-black bg-white">
      <h2 className="text-3xl font-semibold text-gray-800 dark:text-white lg:mb-16 mb-7">
        Assign New Order
      </h2>
      <form
        onSubmit={handleSubmit}
        className="bg-white dark:bg-black rounded-md dark:shadow-lg"
      >
        <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
          <div className="w-[200px]">
            <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">Order Details</div>
          </div>
          <div className="w-full">
            <WarehouseSearch selectedWarehouse={selectedWarehouse} setSelectedWarehouse={setSelectedWarehouse} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
            <ProductSelection onProductSelect={handleProductSelect} selectedWarehouse={selectedWarehouse} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
            <CustomerSearch selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>

          </div>
        </div>
        <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
          <div className="w-[200px]">
            <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">Payment Details</div>
          </div>
          <div className="w-full">
            <div className="flex items-start md:flex-row md:gap-7 gap-6 w-full">
              <OrderType onChange={handleOrderDetailChange} />
              <PaymentStatus onChange={handleOrderDetailChange} orderDetails={orderDetails} />
            </div>
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
          </div>
        </div>


        <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
          <div className="w-[200px]">
            <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">Shipping Details</div>
          </div>
          <div className="w-full">
            <ShippingDetails onEditCustomer={setSelectedCustomer} selectedCustomer={selectedCustomer} onChange={handleShippingDetailsChange} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
          </div>
        </div>
        <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
          <div className="w-[200px]">
            <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">Shipping Partner Details</div>
          </div>
          <div className="w-full">
            <div className="dark:text-white text-black">
              <div className="grid md:grid-cols-2 md:gap-9 gap-5">
                <div className="w-full">
                  <label
                    htmlFor={"shipping_type"}
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                  >
                    Type of Shipping
                  </label>
                  <select
                    type={"select"}
                    id={"shipping_type"}
                    name={"shipping_type"}
                    onChange={({ target }) => handleOrderDetailChange(target.name, target.value)}
                    className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                  >
                    <option value={""} className="w-full dark:bg-gray-600 dark:text-white">Select Type of Shipping</option>
                    <option value={"express"} className="w-full dark:bg-gray-600 dark:text-white">Express</option>
                    <option value={"surface"} className="w-full dark:bg-gray-600 dark:text-white">Surface</option>
                  </select>
                </div>
                <div className="w-full">
                  <label
                    htmlFor={"platform"}
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                  >
                    Shipping Platform
                  </label>
                  <select
                    type={"select"}
                    id={"platform"}
                    name={"platform"}
                    onChange={({ target }) => handleOrderDetailChange(target.name, target.value)}
                    className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                  >
                    <option value={""} className="w-full dark:bg-gray-600 dark:text-white">Select Platform</option>
                    <option value={"nimbus"} className="w-full dark:bg-gray-600 dark:text-white">Nimbus</option>
                    <option value={"delhivery"} className="w-full dark:bg-gray-600 dark:text-white">Delhivery</option>
                    <option value={"others"} className="w-full dark:bg-gray-600 dark:text-white">Others with note</option>
                  </select>
                </div>
                {orderDetails.platform == "others" && <div className="form-control pt-4">
                  <label htmlFor="otherpayment_status" className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] mb-2">
                    Give note for other platform
                  </label>
                  <input
                    name="other_platform"
                    id="other_platform"
                    placeholder="Other Platorm"
                    value={orderDetails.other_platform}
                    onChange={({ target }) => handleOrderDetailChange(target.name, target.value)}
                    className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
                  />
                </div>}
              </div>
            </div>
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
          </div>
        </div>
        <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
          <div className="md:w-[200px]">
            <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">Additional Information</div>
          </div>
          <div className="w-full">

            <div className="form-control">
              <label htmlFor="note" className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4">
                Note
              </label>
              <textarea
                name="note"
                id="note"
                rows={5}
                placeholder="Enter notes, remarks, or instructions..."
                value={orderDetails.note}
                onChange={({ target }) => handleOrderDetailChange(target.name, target.value)}
                className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
              />
            </div>
            <div className="w-full pt-10">
              <label htmlFor="insuranceRequired" onClick={handleInsuranceChange} className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] cursor-pointer md:mb-6 mb-4">
                Insurance Required
              </label>
              <div className="flex items-center gap-6">
                {
                  orderDetails.insuranceRequired ? <span className="md:w-8 md:h-8 h-6 w-6 flex justify-center items-center rounded-md md:text-2xl text-xl dark:text-black cursor-pointer text-white dark:bg-white bg-black" onClick={handleInsuranceChange}>✔</span> : <span className="block md:w-8 md:h-8 h-6 w-6 rounded-md md:text-2xl text-xl dark:bg-white bg-black cursor-pointer" onClick={handleInsuranceChange}></span>
                }
                <div className="dark:text-white text-black text-md md:text-xl font-normal font-['Inter']">{orderDetails.insuranceRequired ? "Yes" : "No"}
                </div>
              </div>

            </div>
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
          </div>
        </div>
        <div className="md:grid-cols-2 md:col-span-2">
          <OrderSummary shippingDetails={shippingDetails} selectedCustomer={selectedCustomer} products={products} />
        </div>
        {validtionMessage && <p className="text-red-500 text-[16px] pt-1 pl-1">{validtionMessage}</p>}
        <button
          type="submit"
          className="w-full lg:col-span-2 py-2 flex items-center justify-center gap-4 my-4 bg-[#2F60F3] text-white rounded-lg shadow-md hover:bg-[#2F60F3] -dark focus:outline-none focus:ring-2 focus:ring-[#2F60F3] focus:ring-opacity-50"
        >
          {loading && <span className="loader"></span>}
          <span>Assign Order</span>

        </button>
      </form>
    </div>
  );
};

export default OrderForm;
