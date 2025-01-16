// import React, { useState } from "react";
// import axios from "axios";
// import ProductSelection from "../Pages/ProductSelection";

// const OrderForm = () => {
//   const [customer, setCustomer] = useState({
//     firstname: "",
//     lastname: "",
//     address: "",
//     pincode: "",
//     phoneNumber: "",
//     city: "",
//     state: "",
//     type: "coach",
//     sport: "Ice Hockey",
//   });

//   const [products, setProducts] = useState([]);
//   const [orderDetails, setOrderDetails] = useState({
//     shippingCharges: 0,
//     codCharges: 0,
//     taxAmount: 0,
//     discount: 0,
//     weight: 0,
//     dimensions: {
//       length: 0,
//       width: 0,
//       height: 0,
//     },
//   });

//   const handleProductSelect = (selectedProducts) => {
//     setProducts(selectedProducts);
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();

//     const orderData = {
//       customer,
//       products: products.map((p) => ({
//         productName: p.name,
//         quantity: p.quantity,
//         price: p.price,
//       })),
//       ...orderDetails,
//     };

//     try {
//       const response = await axios.post("/api/orders/create", orderData);
//       alert("Order created successfully");
//     } catch (error) {
//       console.error("Error creating order", error);
//       alert("Error creating order");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit} className="max-w-2xl mx-auto bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg">
//       <h2 className="text-3xl font-semibold text-gray-800 dark:text-white mb-6">Create New Order</h2>

//       {/* Customer Information */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="First Name"
//           value={customer.firstname}
//           onChange={(e) => setCustomer({ ...customer, firstname: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="text"
//           placeholder="Last Name"
//           value={customer.lastname}
//           onChange={(e) => setCustomer({ ...customer, lastname: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Address"
//           value={customer.address}
//           onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="text"
//           placeholder="City"
//           value={customer.city}
//           onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="State"
//           value={customer.state}
//           onChange={(e) => setCustomer({ ...customer, state: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="text"
//           placeholder="Pincode"
//           value={customer.pincode}
//           onChange={(e) => setCustomer({ ...customer, pincode: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>

//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="text"
//           placeholder="Phone Number"
//           value={customer.phoneNumber}
//           onChange={(e) => setCustomer({ ...customer, phoneNumber: e.target.value })}
//           required
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>

//       {/* Product Selection */}
//       <div className="mb-6">
//         <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Select Products</h3>
//         <ProductSelection onProductSelect={handleProductSelect} />
//       </div>

//       {/* Order Details (Shipping, taxes, etc.) */}
//       <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Order Details</h3>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="number"
//           placeholder="Shipping Charges"
//           value={orderDetails.shippingCharges}
//           onChange={(e) => setOrderDetails({ ...orderDetails, shippingCharges: e.target.value })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="number"
//           placeholder="COD Charges"
//           value={orderDetails.codCharges}
//           onChange={(e) => setOrderDetails({ ...orderDetails, codCharges: e.target.value })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
//         <input
//           type="number"
//           placeholder="Tax Amount"
//           value={orderDetails.taxAmount}
//           onChange={(e) => setOrderDetails({ ...orderDetails, taxAmount: e.target.value })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="number"
//           placeholder="Discount"
//           value={orderDetails.discount}
//           onChange={(e) => setOrderDetails({ ...orderDetails, discount: e.target.value })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>

//       <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-4">Dimensions (cm)</h3>
//       <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//         <input
//           type="number"
//           placeholder="Length"
//           value={orderDetails.dimensions.length}
//           onChange={(e) => setOrderDetails({ ...orderDetails, dimensions: { ...orderDetails.dimensions, length: e.target.value } })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="number"
//           placeholder="Width"
//           value={orderDetails.dimensions.width}
//           onChange={(e) => setOrderDetails({ ...orderDetails, dimensions: { ...orderDetails.dimensions, width: e.target.value } })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//         <input
//           type="number"
//           placeholder="Height"
//           value={orderDetails.dimensions.height}
//           onChange={(e) => setOrderDetails({ ...orderDetails, dimensions: { ...orderDetails.dimensions, height: e.target.value } })}
//           className="p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#2F60F3] dark:bg-gray-700 dark:border-gray-600 dark:text-white"
//         />
//       </div>

//       <button type="submit" className="w-full py-2 bg-[#2F60F3] text-white rounded-lg shadow-md hover:bg-[#2F60F3] -dark focus:outline-none focus:ring-2 focus:ring-[#2F60F3] focus:ring-opacity-50">
//         Submit Order
//       </button>
//     </form>
//   );
// };

// export default OrderForm;



import React, { useState } from "react";
import axios from "axios";
import Accordion from "./Accordion";
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
    weight: 0,
    height: 0,
    length: 0,
    breadth: 0,
    payment_method: "",
    otherpayment_status: "",
    note: "",
    payment_status: "", // Added payment_status to orderDetails
    insuranceRequired: false, // Added insuranceRequired to orderDetails
  });
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [selectedWarehouse, setSelectedWarehouse] = useState(null);
  const [shippingDetails, setShippingDetails] = useState({
    shippingAddress: {
      address: "",
      address_2: "",
      city: "",
      state: "",
      pincode: "",
      country: "",
    },
    shippingCharges: 0,
    codCharges: 0,
    weight: 0,
    height: 0,
    length: 0,
    breadth: 0,
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
      weight: details.weight,
      height: details.height,
      length: details.length,
      breadth: details.breadth,
    }));
  };
  const handleOrderType = (ordertype) => {
    setOrderDetails((prev) => ({
      ...prev,
      payment_method: ordertype,
    }));
  }
  const handlePaymentMethodChange = (name, value) => {
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
    if (orderDetails.weight == 0) {
      setValidationMessage("Weight should not be 0.");
      return;
    }
    if (orderDetails.length == 0) {
      setValidationMessage("Length should not be 0.");
      return;
    }
    if (orderDetails.height == 0) {
      setValidationMessage("Height should not be 0.");
      return;
    }
    if (orderDetails.breadth == 0) {
      setValidationMessage("Breadth should not be 0.");
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
      })),
      shippingDetails: [
        {
          shippingAddress: [
            {
              address: shippingDetails.shippingAddress.address,
              address_2: shippingDetails.shippingAddress.address_2 || "",
              city: shippingDetails.shippingAddress.city,
              state: shippingDetails.shippingAddress.state,
              pincode: shippingDetails.shippingAddress.pincode,
              country: shippingDetails.shippingAddress.country,
            },
          ],
          shippingCharges: shippingDetails.shippingCharges || 0,
          codCharges: shippingDetails.codCharges || 0,
        },
      ],
      taxAmount: orderDetails.taxAmount || 0,
      discount: orderDetails.discount || 0,
      weight: orderDetails.weight || 0,
      height: Number(orderDetails.height) || 0,
      length: Number(orderDetails.length) || 0,
      breadth: Number(orderDetails.breadth) || 0,
      totalAmount: finalAmount,
      insuranceRequired: orderDetails.insuranceRequired, // Include insurance in orderData
    };

    console.log("Sending order data:", orderData);

    const confirmSubmission = window.confirm(
      "Are you sure you want to submit this order?"
    );
    if (!confirmSubmission) return;
    try {
      console.log(orderData);
      const response = await axios.post("/api/orders/create", orderData);
      alert(
        "Order created successfully with Order ID: " +
        response.data.order_id
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
        Create New Order
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
            <ProductSelection onProductSelect={handleProductSelect} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
            <CustomerSearch selectedCustomer={selectedCustomer} setSelectedCustomer={setSelectedCustomer} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
            <WarehouseSearch selectedWarehouse={selectedWarehouse} setSelectedWarehouse={setSelectedWarehouse} />
            <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
          </div>
        </div>
        <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
          <div className="w-[200px]">
            <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">Payment Details</div>
          </div>
          <div className="w-full">
            <div className="flex items-start md:flex-row md:gap-7 gap-6 w-full">
              <OrderType onChange={handleOrderType} />
              <PaymentStatus onChange={handlePaymentMethodChange} orderDetails={orderDetails} />
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
                onChange={({ target }) => handlePaymentMethodChange(target.name, target.value)}
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
          <span>Submit Order</span>

        </button>
      </form>
    </div>
  );
};

export default OrderForm;
