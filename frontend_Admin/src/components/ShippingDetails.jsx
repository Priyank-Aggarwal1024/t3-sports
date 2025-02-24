import React, { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import useCustomer from "../contexts/useCustomer";
import PropTypes from "prop-types";

const addressInitialState = {
  address: "",
  pincode: "",
  state: "",
  city: "",
};
const ShippingDetails = ({ onChange, selectedCustomer, onEditCustomer }) => {
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
  const [addressErrorMessage, setAddressErrorMessage] =
    useState(addressInitialState);

  const [edit, setEdit] = useState(false);
  const handleAddressChange = (e) => {
    const { name, value } = e.target;
    setAddress((prev) => ({ ...prev, [name]: value }));
  };

  const handleChargesChange = (e) => {
    const { name, value } = e.target;
    setCharges((prev) => ({ ...prev, [name]: parseFloat(value) || 0 }));
  };

  const handleSaveAddress = async () => {
    if (!address.address || !address.address.trim() === "") {
      setAddressErrorMessage({
        ...addressInitialState,
        address: "Enter address",
      });
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
      setAddressErrorMessage({
        ...addressInitialState,
        country: "Enter country",
      });
      return;
    }
    if (!address.pincode || !address.pincode.trim() === "") {
      setAddressErrorMessage({
        ...addressInitialState,
        pincode: "Enter pincode",
      });
      return;
    }
    if (address.pincode.length != 6) {
      setAddressErrorMessage({
        ...addressInitialState,
        pincode: "Pincode have 6 digits",
      });
      return;
    }
    if (!selectedCustomer || !selectedCustomer._id) {
      window.alert("Please select customer first");
      return;
    }
    try {
      delete address["address_2"];
      const newCus = await editCustomer(selectedCustomer._id, address);
      if (newCus) {
        onEditCustomer(newCus);
        setAddress({
          ...address,
          city: newCus.city,
          state: newCus.state,
          pincode: newCus.pincode,
          address: newCus.address,
        });
      }
      setEdit(false);
      setAddressErrorMessage(addressInitialState);
    } catch (err) {
      toast.error(err.message);
    }
  };
  // Update the parent component with new data whenever address, charges, or dimensions change
  useEffect(() => {
    onChange({
      shippingAddress: address,
      ...charges,
    });
  }, [address, charges, selectedCustomer]);
  useEffect(() => {
    setAddress({
      address: selectedCustomer?.address || "",
      address_2: "",
      city: selectedCustomer?.city || "",
      state: selectedCustomer?.state || "",
      pincode: selectedCustomer?.pincode || "",
      country: selectedCustomer?.country || "",
    });
  }, [selectedCustomer]);
  return (
    <div className="dark:text-white text-black">
      {/* <h2 className="text-3xl font-bold">Shipping Details</h2> */}
      {!selectedCustomer && (
        <h2 className="text-xl text-red-500 pb-4">
          First select the customer then fill shipping details
        </h2>
      )}
      <div className="grid md:grid-cols-2 md:gap-9 gap-5">
        <div className="w-full">
          {edit ? (
            <div className="">
              <label
                htmlFor="address"
                className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
              >
                Address
              </label>
              <input
                id="address"
                name="address"
                placeholder="Address"
                value={address.address}
                onChange={handleAddressChange}
                className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
              />
            </div>
          ) : (
            <div className="w-full">
              <p className="w-full md:mb-6 mb-4 text-gray-800 dark:text-white md:text-xl text-[15px] font-normal font-['Inter']">
                Address
              </p>
              <p className="w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md dark:bg-[#121212] bg-gray-300 ">
                {selectedCustomer?.address}
              </p>
            </div>
          )}
          {addressErrorMessage["address"] && (
            <p className="text-red-500 text-[12px] pt-1 pl-1">
              {addressErrorMessage["address"]}
            </p>
          )}
        </div>
        <div className="w-full">
          {edit ? (
            <div className="">
              <label
                htmlFor="city"
                className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
              >
                City
              </label>
              <input
                id="city"
                name="city"
                placeholder="City"
                value={address.city}
                onChange={handleAddressChange}
                className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
              />{" "}
            </div>
          ) : (
            <div className="w-full">
              <p className="w-full md:mb-6 mb-4 text-gray-800 dark:text-white md:text-xl text-[15px] font-normal font-['Inter']">
                City
              </p>
              <p className="w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md dark:bg-[#121212] bg-gray-300 ">
                {selectedCustomer?.city}
              </p>
            </div>
          )}
          {addressErrorMessage["city"] && (
            <p className="text-red-500 text-[12px] pt-1 pl-1">
              {addressErrorMessage["city"]}
            </p>
          )}
        </div>
        <div className="w-full">
          {edit ? (
            <div className="">
              <label
                htmlFor="state"
                className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
              >
                State
              </label>
              <input
                id="state"
                name="state"
                placeholder="State"
                value={address.state}
                onChange={handleAddressChange}
                className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
              />{" "}
            </div>
          ) : (
            <div className="w-full">
              <p className="w-full md:mb-6 mb-4 text-gray-800 dark:text-white md:text-xl text-[15px] font-normal font-['Inter']">
                State
              </p>
              <p className="w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md dark:bg-[#121212] bg-gray-300 ">
                {selectedCustomer?.state}
              </p>
            </div>
          )}
          {addressErrorMessage["state"] && (
            <p className="text-red-500 text-[12px] pt-1 pl-1">
              {addressErrorMessage["state"]}
            </p>
          )}
        </div>
        <div className="w-full">
          {edit ? (
            <div className="">
              <label
                htmlFor="country"
                className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
              >
                Country
              </label>
              <input
                id="country"
                name="country"
                placeholder="Country"
                value={address.country}
                onChange={handleAddressChange}
                className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
              />{" "}
            </div>
          ) : (
            <div className="w-full">
              <p className="w-full md:mb-6 mb-4 text-gray-800 dark:text-white md:text-xl text-[15px] font-normal font-['Inter']">
                Country
              </p>
              <p className="w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md dark:bg-[#121212] bg-gray-300 ">
                {selectedCustomer?.country}
              </p>
            </div>
          )}
          {addressErrorMessage["country"] && (
            <p className="text-red-500 text-[12px] pt-1 pl-1">
              {addressErrorMessage["country"]}
            </p>
          )}
        </div>
        <div className="w-full">
          {edit ? (
            <div className="">
              <label
                htmlFor="pincode"
                className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
              >
                Pincode
              </label>
              <input
                id="pincode"
                name="pincode"
                placeholder="Pincode"
                value={address.pincode}
                onChange={handleAddressChange}
                className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
              />{" "}
            </div>
          ) : (
            <div className="w-full">
              <p className="w-full md:mb-6 mb-4 text-gray-800 dark:text-white md:text-xl text-[15px] font-normal font-['Inter']">
                Pincode
              </p>
              <p className="w-full md:py-4 py-2.5 md:px-6 px-4 rounded-md dark:bg-[#121212] bg-gray-300 ">
                {selectedCustomer?.pincode}
              </p>
            </div>
          )}
          {addressErrorMessage["pincode"] && (
            <p className="text-red-500 text-[12px] pt-1 pl-1">
              {addressErrorMessage["pincode"]}
            </p>
          )}
        </div>
        <div className="w-full flex flex-col gap-7 items-start justify-center">
          <div className="w-full flex items-center justify-center md:gap-7 gap-4">
            {edit ? (
              <div
                className="text-[#3c98d6] text-xl font-semibold font-['Inter'] cursor-pointer"
                onClick={handleSaveAddress}
              >
                Save Address
              </div>
            ) : (
              <div
                className="text-[#3c98d6] md:text-xl text-lg font-semibold font-['Inter'] cursor-pointer"
                onClick={() => setEdit(true)}
              >
                Edit Address
              </div>
            )}
          </div>
        </div>
        <div className="w-full md:pt-12 pt-0 md:col-span-2"></div>
        <div className="w-full">
          <label
            htmlFor="shippingCharges"
            className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4"
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
            className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
          />
        </div>
        <div className="w-full">
          <label
            htmlFor="codCharges"
            className="block md:text-[20px] text-[15px] dark:text-white text-black font-['Inter'] md:mb-6 mb-4 whitespace-nowrap"
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
            className="w-full md:py-4 py-2.5 md:px-6 px-4 dark:text-white text-black text-sm dark:bg-[#121212] bg-gray-300  shadow-sm rounded-md"
          />
        </div>
      </div>
    </div>
  );
};
ShippingDetails.propTypes = {
  onChange: PropTypes.func.isRequired,
  onEditCustomer: PropTypes.func.isRequired,
  selectedCustomer: PropTypes.oneOfType([
    PropTypes.shape({
      _id: PropTypes.string,
      address: PropTypes.string,
      city: PropTypes.string,
      state: PropTypes.string,
      pincode: PropTypes.string,
      country: PropTypes.string,
    }),
    PropTypes.oneOf([null]),
  ]),
};
export default ShippingDetails;
