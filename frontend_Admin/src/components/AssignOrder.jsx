import React, { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import useProducts from "../contexts/useProducts";
function AssignOrder() {
  const { products } = useProducts();
  const { id } = useParams();
  const [order, setOrder] = useState({});
  const [validtionMessage, setValidationMessage] = useState("");
  const [dimensions, setDimensions] = useState({
    weight: 0,
    height: 0,
    length: 0,
    breadth: 0,
  });
  const [nimbusprice, setNimbusPrice] = useState({});

  const [editdata, setEditData] = useState({});
  const navigate = useNavigate();
  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const fetchOrderById = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`);
      if (response.data.success) {
        setOrder(response.data.order);
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  const handleChange = ({ target }) => {
    setEditData({ ...editdata, [target.name]: target.value });
  };
  const handleSubmit = async () => {
    if (dimensions?.weight == 0) {
      setValidationMessage("Weight should not be 0.");
      return;
    }
    if (dimensions["length"] == 0) {
      setValidationMessage("Length should not be 0.");
      return;
    }
    if (dimensions?.height == 0) {
      setValidationMessage("Height should not be 0.");
      return;
    }
    if (dimensions?.breadth == 0) {
      setValidationMessage("Breadth should not be 0.");
      return;
    }
    if (editdata?.payment_method?.trim() == "") {
      setValidationMessage("Order type should be valid ");
      return;
    }
    if (!editdata?.payment_status?.trim() == "") {
      setValidationMessage(
        "Please select a payment method before submitting the order."
      );
      return;
    }
    if (
      editdata?.payment_status == "others" &&
      editdata?.otherpayment_status?.trim() == ""
    ) {
      setValidationMessage(
        "Give the comment on payment method before submitting the order."
      );
      return;
    }
    if (editdata?.shipping_type?.trim() === "") {
      setValidationMessage("Type of shipping should be valid.");
      return;
    }
    if (editdata?.platform?.trim() === "") {
      setValidationMessage("Platform should be valid.");
      return;
    }
    if (
      editdata?.platform === "others" &&
      editdata?.other_platform?.trim() === ""
    ) {
      setValidationMessage("Give Other Shipping Platform note.");
      return;
    }
    setValidationMessage("");
    const products = order.products
      ? order.products.map((prod) => {
          if (nimbusprice[prod._id]) {
            return {
              ...prod,
              price: nimbusprice[prod._id],
            };
          } else {
            return {
              ...prod,
              price: 0,
            };
          }
        })
      : [];
    const data = { ...editdata, ...dimensions, nimbusProducts: products };
    try {
      const response = await axios.put(`/api/orders/fulfill/${id}`, data);
      if (response.data.success) {
        alert(
          response.data.message + ` Order id :- ${response.data?.order_id}`
        );
        navigate("/");
      } else {
        toast.error(response.data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };
  useEffect(() => {
    fetchOrderById();
  }, [id]);
  return (
    <div className="dark:bg-black bg-white sm:px-8 sm:p-4 p-2">
      <div className="flex w-full sm:item-center sm:justify-between gap-2 xs:flex-row flex-col mb-6">
        <h2 className="text-3xl font-semibold text-gray-800 dark:text-white w-full">
          Final Order
        </h2>

        <span className="text-lg font-bold inline-block dark:text-gray-100">
          #{order?.order_number}
        </span>
      </div>
      <div className="bg-gray-100 dark:bg-transparent text-gray-900 dark:text-gray-100  lg:mb-16 mb-7 w-full">
        <div className="md:p-4 py-3">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Order Details</h1>
          </div>

          {/* Warehouse Section */}
          <div className="xs:mb-6 mb-3 xs:p-4 p-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Warehouse</h2>
            <p>
              <strong>Name:</strong> {order?.warehouse_id?.name}
            </p>
            <p>
              <strong>Address:</strong> {order?.warehouse_id?.address}
            </p>
            <p>
              <strong>Email:</strong> {order?.warehouse_id?.email}
            </p>
          </div>

          {/* Customer Section */}
          <div className="xs:mb-6 mb-3 xs:p-4 p-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Customer</h2>
            <p>
              <strong>Name:</strong> {order?.customer?.fname}{" "}
              {order?.customer?.lname}
            </p>
            <p>
              <strong>Email:</strong> {order?.customer?.email}
            </p>
            <p>
              <strong>Phone:</strong> {order?.customer?.phone}
            </p>
            <p>
              <strong>Address:</strong> {order?.customer?.address},{" "}
              {order?.customer?.city}, {order?.customer?.state},{" "}
              {order?.customer?.country}
            </p>
          </div>

          {/* Products Section */}
          <div className="xs:p-4 p-2 w-full bg-white dark:bg-gray-800 rounded-md shadow-md">
            <h2 className="text-xl font-semibold mb-2">Products</h2>
            <div className=" max-w-full overflow-x-auto">
              <table className="table-auto border-collapse w-full">
                <thead>
                  <tr className="bg-gray-200 dark:bg-gray-700">
                    <th className="border px-4 py-2">Product Name</th>
                    <th className="border px-4 py-2">Quantity</th>
                    <th className="border px-4 py-2">Size</th>
                    <th className="border px-4 py-2">Price</th>
                  </tr>
                </thead>
                <tbody>
                  {order &&
                    order.products &&
                    order.products.map((product, index) => (
                      <tr
                        key={index}
                        className="odd:bg-gray-100 even:bg-gray-50 dark:odd:bg-gray-800 dark:even:bg-gray-700"
                      >
                        <td className="border px-4 py-2 text-left">
                          {product.productName}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {product.quantity}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          {products.find((p) => p._id == product._id)?.size}
                        </td>
                        <td className="border px-4 py-2 text-center">
                          ₹{product.price}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
        <div className="w-[200px]">
          <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">
            Edit Order
          </div>
        </div>
        <div className="w-full">
          <div className="flex items-start md:flex-row flex-col md:gap-7 gap-6 w-full">
            <div className="space-y-4 w-full">
              <div className="form-control">
                <label
                  htmlFor="payment_method"
                  className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                  Order Type
                </label>
                <select
                  id="payment_method"
                  name="payment_method"
                  onChange={handleChange}
                  value={
                    editdata?.payment_method || order?.payment_method || ""
                  }
                  className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] hover:cursor-pointer text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="prepaid">Prepaid</option>
                  <option value="COD">Cash on Delivery (COD)</option>
                </select>
              </div>
            </div>

            <div className="space-y-4 w-full">
              <div className="form-control">
                <label
                  htmlFor="payment_status"
                  className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                  Payment Status *
                </label>
                <select
                  id="payment_status"
                  name="payment_status"
                  onChange={handleChange}
                  value={
                    editdata?.payment_status || order?.payment_status || ""
                  }
                  className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] hover:cursor-pointer text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
                >
                  <option value="">Select</option>
                  <option value="paid">Paid</option>
                  <option value="partially">Partially Paid</option>
                  <option value="credit">Credit</option>
                  <option value="others">Others</option>
                </select>
              </div>
              {editdata?.payment_status == "others" && (
                <div className="form-control pt-4">
                  <label
                    htmlFor="otherpayment_status"
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] mb-2"
                  >
                    Give Comment for payment status
                  </label>
                  <input
                    name="otherpayment_status"
                    id="otherpayment_status"
                    placeholder="Payment status"
                    value={editdata?.otherpayment_status || ""}
                    onChange={handleChange}
                    className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] hover:cursor-pointer text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
        </div>
      </div>
      <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4">
        <div className="w-[200px]">
          <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">
            Edit Shipping Partner Details
          </div>
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
                  onChange={handleChange}
                  value={editdata?.shipping_type || order?.shipping_type || ""}
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                >
                  <option
                    value={""}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Select Type of Shipping
                  </option>
                  <option
                    value={"express"}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Express
                  </option>
                  <option
                    value={"surface"}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Surface
                  </option>
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
                  onChange={handleChange}
                  value={editdata?.platform || order?.platform || ""}
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                >
                  <option
                    value={""}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Select Platform
                  </option>
                  <option
                    value={"nimbus"}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Nimbus
                  </option>
                  <option
                    value={"delhivery"}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Delhivery
                  </option>
                  <option
                    value={"others"}
                    className="w-full dark:bg-gray-600 dark:text-white"
                  >
                    Others with note
                  </option>
                </select>
              </div>
              {editdata?.platform == "others" && (
                <div className="form-control pt-4">
                  <label
                    htmlFor="otherpayment_status"
                    className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] mb-2"
                  >
                    Give note for other platform
                  </label>
                  <input
                    name="other_platform"
                    id="other_platform"
                    placeholder="Other Platorm"
                    value={editdata?.other_platform}
                    onChange={handleChange}
                    className="block w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md focus:outline-none focus:ring-[#2F60F3] focus:border-[#2F60F3] text-sm  dark:text-white shadow-md dark:bg-[#121212] bg-gray-300 placeholder:dark:text-[#858585] placeholder:text-gray-700"
                  />
                </div>
              )}
            </div>
          </div>
          <div className="w-full dark:bg-[#8A8A8A] bg-gray-600 lg:my-16 my-8 h-[0.5px]"></div>
        </div>
      </div>
      <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4 pt-6 sm:pt-4">
        <div className="w-[200px]">
          <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">
            Order Specification
          </div>
        </div>
        <div className="w-full">
          <div className="dark:text-white text-black">
            <div className="grid md:grid-cols-2 md:gap-9 gap-5">
              <div className="w-full">
                <label
                  htmlFor="weight"
                  className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                  Weight (in grams):
                </label>
                <input
                  name="weight"
                  type="number"
                  min={0}
                  placeholder="Weight (g)"
                  value={dimensions.weight}
                  onChange={handleDimensionChange}
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="height"
                  className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                  Height (in cm):
                </label>
                <input
                  name="height"
                  type="number"
                  min={0}
                  placeholder="Height (cm)"
                  value={dimensions.height}
                  onChange={handleDimensionChange}
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="length"
                  className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                  Length (in cm):
                </label>
                <input
                  name="length"
                  type="number"
                  min={0}
                  placeholder="Length (cm)"
                  value={dimensions.length}
                  onChange={handleDimensionChange}
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
              </div>
              <div className="w-full">
                <label
                  htmlFor="breadth"
                  className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
                >
                  Breadth (in cm):
                </label>
                <input
                  name="breadth"
                  type="number"
                  min={0}
                  placeholder="Breadth (cm)"
                  value={dimensions.breadth}
                  onChange={handleDimensionChange}
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
              </div>
              <div className="w-full md:col-span-2">
                <label className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4">
                  Volumetric Weight:
                </label>
                <input
                  readOnly
                  placeholder="Volumetric Weight"
                  value={
                    (dimensions.breadth *
                      dimensions.height *
                      dimensions.length) /
                    5000
                  }
                  className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="flex w-full items-start lg:flex-row flex-col md:gap-8 gap-4 pt-6 sm:pt-4">
        <div className="w-[200px]">
          <div className="text-[#3c98d6] text-xl font-medium font-['Inter']">
            Add Nimbus Price
          </div>
        </div>
        <div className="w-full">
          <div className="dark:text-white text-black">
            <div className="flex flex-col gap-2 lg:mt-12 md:mt-6 mt-3">
              <div className="flex w-full dark:bg-black bg-white py-2 lg:px-8 px-4 text-center">
                <p className="dark:text-[#868686] text-black text-sm w-full">
                  Name
                </p>
                <p className="dark:text-[#868686] text-black text-sm w-full">
                  Quantity
                </p>
                <p className="dark:text-[#868686] text-black text-sm w-full">
                  Price
                </p>
                <p className="dark:text-[#868686] text-black text-sm w-full">
                  Nimbus Price
                </p>
              </div>
              {order &&
                order.products &&
                order.products.map((product) => (
                  <div
                    key={product._id}
                    className="lg:p-8 md:p-6 p-4 border flex justify-between items-center w-full border-gray-600 rounded-xl dark:bg-[#121212] bg-gray-300 dark:text-white text-black text-center"
                  >
                    <h4 className="font-semibold w-full">
                      {product?.productName}
                    </h4>
                    <h4 className="font-semibold w-full">
                      {product?.quantity}
                    </h4>
                    <h4 className="font-semibold w-full">
                      {product?.price.toFixed(2)}
                    </h4>
                    <div className="w-full flex justify-center gap-2 items-center">
                      <p className="">₹</p>
                      <input
                        type="number"
                        min="0"
                        value={nimbusprice[product?._id] || "0"} // Default value to 1
                        onChange={(e) =>
                          setNimbusPrice({
                            ...nimbusprice,
                            [product?._id]: +e.target.value,
                          })
                        }
                        className="block w-[64px] rounded-md p-1 pl-4 dark:bg-black bg-white shadow-sm border  dark:text-white text-black text-sm"
                      />
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>

      {validtionMessage && (
        <p className="text-red-500 text-[16px] pt-1 pl-1">{validtionMessage}</p>
      )}
      <button
        onClick={handleSubmit}
        className="w-full lg:col-span-2 py-2 flex items-center justify-center gap-4 my-4 bg-[#2F60F3] text-white rounded-lg shadow-md hover:bg-[#2F60F3] -dark focus:outline-none focus:ring-2 focus:ring-[#2F60F3] focus:ring-opacity-50"
      >
        <span>Fulfill Order</span>
      </button>
    </div>
  );
}

export default AssignOrder;
