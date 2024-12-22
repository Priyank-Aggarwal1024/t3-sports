import axios from "axios";
import React, { useEffect, useState } from "react";
import { toast } from 'react-hot-toast'
import useCustomer from "../contexts/useCustomer";
const addressInitialState = {
  address: "",
  pincode: "",
  state: "",
  city: "",
}
const ShippingDetails = ({ onChange, selectedCustomer, onEditCustomer }) => {
  console.log(selectedCustomer)
  const [address, setAddress] = useState({
    address: selectedCustomer?.address || "",
    address_2: "",
    city: selectedCustomer?.city || "",
    state: selectedCustomer?.state || "",
    pincode: selectedCustomer?.pincode || "",
    country: selectedCustomer?.country || "",
  });
  const { editCustomer } = useCustomer();
  const [charges, setCharges] = useState({
    shippingCharges: 0,
    codCharges: 0,
  });
  const [addressErrorMessage, setAddressErrorMessage] = useState(addressInitialState)
  const [dimensions, setDimensions] = useState({
    weight: 0,
    height: 0,
    length: 0,
    breadth: 0,
  });
  const [edit, setEdit] = useState(false);
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleChargesChange = (e) => {
    const { name, value } = e.target;
    setCharges((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleDimensionChange = (e) => {
    const { name, value } = e.target;
    setDimensions((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };
  const handleSaveAddress = async (e) => {
    if (!address.address || !address.address.trim() === "") {
      setAddressErrorMessage({ ...addressInitialState, address: "Enter address" });
      return;
    }
    if (!address.city || !address.city.trim() === "") {
      setAddressErrorMessage({ ...addressInitialState, city: "Enter city" });
      return;
    }
    if (!address.state || !address.state.trim() === "") {
      setAddressErrorMessage({ ...addressInitialState, state: "Enter state" });
      return;
    }
    if (!address.country || !address.country.trim() === "") {
      setAddressErrorMessage({ ...addressInitialState, country: "Enter country" });
      return;
    }
    if (!address.pincode || !address.pincode.trim() === "") {
      setAddressErrorMessage({ ...addressInitialState, pincode: "Enter pincode" });
      return;
    }
    if (address.pincode.length != 6) {
      setAddressErrorMessage({ ...addressInitialState, pincode: "Pincode have 6 digits" });
      return;
    }
    if (!selectedCustomer || !selectedCustomer._id) {
      window.alert("Please select customer first");
      return;
    }
    try {
      const { address_2, ...editadress } = address;
      const newCus = await editCustomer(selectedCustomer._id, editadress);
      if (newCus) {
        onEditCustomer(newCus);
        setAddress({ ...address, city: newCus.city, state: newCus.state, pincode: newCus.pincode, address: newCus.address })
      }
      setEdit(false);
      setAddressErrorMessage(addressInitialState);
    } catch (err) {
      toast.error(err.message);
    }
  }
  // Update the parent component with new data whenever address, charges, or dimensions change
  useEffect(() => {
    onChange({
      shippingAddress: address,
      ...charges,
      ...dimensions,
    });
  }, [address, charges, dimensions, selectedCustomer]);

  return (
    <div className="dark:text-white text-black">
      {/* <h2 className="text-3xl font-bold">Shipping Details</h2> */}
      {!selectedCustomer && <h2 className="text-xl text-red-500">First select the customer then fill shipping details</h2>}
      <div className="grid md:grid-cols-2 gap-2">
        <div className="w-full">
          {edit ? <input
            name="address"
            placeholder="Address"
            value={address.address}
            onChange={handleAddressChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          /> : <p className="my-auto w-full">Address :<br /> {selectedCustomer?.address}</p>}
          {
            addressErrorMessage["address"] && <p className="text-red-500 text-[12px] pt-1 pl-1">{addressErrorMessage["address"]}</p>
          }
        </div>
        <div className="w-full">
          {edit ? <input
            name="city"
            placeholder="City"
            value={address.city}
            onChange={handleAddressChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          /> : <p className="my-auto w-full">City :<br /> {selectedCustomer?.city}</p>}
          {
            addressErrorMessage["city"] && <p className="text-red-500 text-[12px] pt-1 pl-1">{addressErrorMessage["city"]}</p>
          }
        </div>
        <div className="w-full">

          {edit ? <input
            name="state"
            placeholder="State"
            value={address.state}
            onChange={handleAddressChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          /> : <p className="my-auto w-full">State :<br /> {selectedCustomer?.state}</p>}
          {
            addressErrorMessage["state"] && <p className="text-red-500 text-[12px] pt-1 pl-1">{addressErrorMessage["state"]}</p>
          }
        </div>
        <div className="w-full">

          {edit ? <input
            name="country"
            placeholder="Country"
            value={address.country}
            onChange={handleAddressChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          /> : <p className="my-auto w-full">Country :<br /> {selectedCustomer?.country}</p>}
          {
            addressErrorMessage["country"] && <p className="text-red-500 text-[12px] pt-1 pl-1">{addressErrorMessage["country"]}</p>
          }
        </div>
        <div className="w-full">

          {edit ? <input
            name="pincode"
            placeholder="Pincode"
            value={address.pincode}
            onChange={handleAddressChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          /> : <p className="my-auto w-full">Pincode :<br /> {selectedCustomer?.pincode}</p>}
          {
            addressErrorMessage["pincode"] && <p className="text-red-500 text-[12px] pt-1 pl-1">{addressErrorMessage["pincode"]}</p>
          }
        </div>
        {edit ? <div className="w-full md:col-span-2 bg-green-600 text-center py-1 rounded-lg mx-auto cursor-pointer" onClick={handleSaveAddress}>Save Address</div> : <div className="w-full md:col-span-2 bg-primary text-center py-1 rounded-lg mx-auto cursor-pointer" onClick={() => setEdit(true)}>Edit Address</div>}
        <input
          name="address_2"
          placeholder="Other Address"
          value={address.address_2}
          onChange={handleAddressChange}
          className="w-full p-2 md:col-span-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md "
        />
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <label
            htmlFor="shippingCharges"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap w-full my-auto"
          >
            Shipping Charges:
          </label>
          <input
            min={0}
            name="shippingCharges"
            type="number"
            placeholder="Shipping Charges"
            value={charges.shippingCharges}
            onChange={handleChargesChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          />
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
          <label
            htmlFor="codCharges"
            className="block w-full text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            COD Charges:
          </label>
          <input
            min={0}
            name="codCharges"
            type="number"
            placeholder="COD Charges"
            value={charges.codCharges}
            onChange={handleChargesChange}
            className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
          />
        </div>

        {/* Adding input fields for dimensions */}
        <div className="grid grid-cols-2 md:col-span-2 gap-4 mt-4 w-full ">
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <label
              htmlFor="weight"
              className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap w-full"
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
              className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <label
              htmlFor="height"
              className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap w-full"
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
              className="p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md w-full"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <label
              htmlFor="length"
              className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap w-full"
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
              className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
            />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <label
              htmlFor="breadth"
              className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap w-full"
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
              className="w-full p-2 dark:text-white text-black text-sm dark:bg-black bg-white shadow-sm rounded-md"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
