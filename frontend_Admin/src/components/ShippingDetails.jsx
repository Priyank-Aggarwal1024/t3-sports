import React, { useEffect, useState } from "react";

const ShippingDetails = ({ onChange }) => {
  const [address, setAddress] = useState({
    address: "",
    address_2: "",
    city: "",
    state: "",
    pincode: "",
    country: "",
  });

  const [charges, setCharges] = useState({
    shippingCharges: 0,
    codCharges: 0,
  });

  const [dimensions, setDimensions] = useState({
    weight: 0,
    height: 0,
    length: 0,
    breadth: 0,
  });

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

  // Update the parent component with new data whenever address, charges, or dimensions change
  useEffect(() => {
    onChange({
      shippingAddress: address,
      ...charges,
      ...dimensions,
    });
  }, [address, charges, dimensions]);

  return (
    <div className="dark:text-white text-black">
      {/* <h2 className="text-3xl font-bold">Shipping Details</h2> */}
      <div className="grid grid-cols-2 gap-2">
        <input
          name="address"
          placeholder="Address"
          value={address.address}
          onChange={handleAddressChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        <input
          name="address_2"
          placeholder="Other Address"
          value={address.address_2}
          onChange={handleAddressChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        <input
          name="city"
          placeholder="City"
          value={address.city}
          onChange={handleAddressChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        <input
          name="state"
          placeholder="State"
          value={address.state}
          onChange={handleAddressChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        <input
          name="pincode"
          placeholder="Pincode"
          value={address.pincode}
          onChange={handleAddressChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        <input
          name="country"
          placeholder="Country"
          value={address.country}
          onChange={handleAddressChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />

<div className="flex flex-col md:flex-row gap-2 items-center">
        <label
            htmlFor="shippingCharges"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            Shipping Charges:
          </label>
        <input
          name="shippingCharges"
          type="number"
          placeholder="Shipping Charges"
          value={charges.shippingCharges}
          onChange={handleChargesChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        </div>
        <div className="flex flex-col md:flex-row gap-2 items-center">
        <label
            htmlFor="codCharges"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            COD Charges:
          </label>
        <input
          name="codCharges"
          type="number"
          placeholder="COD Charges"
          value={charges.codCharges}
          onChange={handleChargesChange}
          className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
        />
        </div>

        {/* Adding input fields for dimensions */}
        <div className="grid grid-cols-2 gap-4 mt-4">
          <div className="flex flex-col md:flex-row gap-2 items-center">
        <label
            htmlFor="weight"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            Weight (in grams):
          </label>
          <input
            name="weight"
            type="number"
            placeholder="Weight (g)"
            value={dimensions.weight}
            onChange={handleDimensionChange}
            className="w-full px-4 py-2 border-0 rounded-md bg-white dark:bg-black text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
        <label
            htmlFor="height"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            Height (in cm):
          </label>
          <input
            name="height"
            type="number"
            placeholder="Height (cm)"
            value={dimensions.height}
            onChange={handleDimensionChange}
            className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
          />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
        <label
            htmlFor="length"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            Length (in cm):
          </label>
          <input
            name="length"
            type="number"
            placeholder="Length (cm)"
            value={dimensions.length}
            onChange={handleDimensionChange}
            className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
          />
          </div>
          <div className="flex flex-col md:flex-row gap-2 items-center">
        <label
            htmlFor="breadth"
            className="block text-gray-700 dark:text-gray-300 mb-2 whitespace-nowrap"
          >
            Breadth (in cm):
          </label>
          <input
            name="breadth"
            type="number"
            placeholder="Breadth (cm)"
            value={dimensions.breadth}
            onChange={handleDimensionChange}
            className="w-full p-2 dark:text-white text-black text-sm bg-black rounded-md"
          />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ShippingDetails;
