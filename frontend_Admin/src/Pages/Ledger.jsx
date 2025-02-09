import React, { useState, useEffect } from "react";
import axios from "axios"; // We'll use axios to fetch data from the backend
import useCustomer from "../contexts/useCustomer";
import toast from "react-hot-toast";
import { exportToExcel } from "react-json-to-excel";
import { FaUserAlt } from "react-icons/fa"; // Import FontAwesome icons

const transactionTypeDisplay = {
  debit: "Sales Invoice",
  "transaction-in": "Transaction In",
  "transaction-out": "Transaction Out",
};

const LedgerComponent = () => {
  const { customers } = useCustomer();
  const [ledgers, setLedgers] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [transactionType, setTransactionType] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");
  const [filterCustomer, setFilterCustomer] = useState(customers);
  const [updateLedgerId, setUpdateLedgerId] = useState("");
  const [uamount, setUAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  // Handle customer selection
  const handleCustomerSelect = (customer) => {
    setSelectedCustomer(customer);
  };
  const filterCustomerHandler = (searchText) => {
    const regex = new RegExp(searchText, "i");

    const filtered = customers.filter((customer) => {
      return regex.test(customer?.fname) || regex.test(customer?.lname);
    });

    setFilterCustomer(filtered || []);
  };
  const handleSaveLedger = async () => {
    if (!uamount || isNaN(uamount) || uamount <= 0) {
      setMessage("Please enter a valid positive amount.");
      return;
    }

    try {
      setLoading(true);
      setMessage("");

      const response = await axios.put(`/api/ledger/${updateLedgerId}`, {
        amount: uamount,
      });

      if (response.data.success) {
        setMessage("Ledger updated successfully!");
      } else {
        setMessage(response.data.message || "Failed to update ledger.");
      }
    } catch (error) {
      console.error("Error updating ledger:", error);
      setMessage(error.response?.data?.message || "An error occurred.");
    } finally {
      setLoading(false);
      setUpdateLedgerId("");
    }
  };
  const handleCreateLedger = () => {
    console.log(selectedCustomer, transactionType, date, amount);
    if (!selectedCustomer || !transactionType || !amount || !date) {
      alert("Please fill in all fields");
      return;
    }
    // Create a new ledger entry
    const newLedger = {
      customer: selectedCustomer,
      transactionType,
      amount,
      date,
    };

    // Make an API request to create the ledger
    axios
      .post("/api/ledger/create", newLedger)
      .then((response) => {
        setLedgers([...ledgers, response.data.ledger]); // Update the state with the new ledger
        toast.success("Ledger entry created successfully!");
        // Clear the form
        setTransactionType("");
        setAmount("");
        setDate("");
      })
      .catch((error) => {
        console.log(error);
        toast.error("Error creating ledger:", error.message);
      });
  };
  useEffect(() => {
    axios
      .get("/api/ledger") // Fetch all ledgers from backend at once
      .then((response) => setLedgers(response.data.ledgers))
      .catch((error) => console.error("Error fetching ledgers:", error));
  }, [loading]);
  useEffect(() => {
    setFilterCustomer(customers);
  }, [customers]);
  return (
    <div
      className={`min-h-screen dark:bg-black dark:text-white bg-white text-black p-6`}
    >
      <div className="flex flex-col md:flex-row">
        {/* Left side: Customer List */}
        <div className="md:w-1/4 max-h-screen h-screen overflow-y-auto bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg mb-6 md:mb-0">
          <h2 className="text-xl font-bold mb-4">Select Customer</h2>
          <div className="relative mb-3">
            <input
              type="text"
              id="serachtext"
              onChange={(e) => filterCustomerHandler(e.target.value)}
              className="p-2 pl-10 pr-4 w-full border rounded-md shadow-sm text-black dark:text-white bg-white dark:bg-black border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400"
            />
            <FaUserAlt
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500 dark:text-blue-400"
              size={20}
            />
          </div>
          <div className="space-y-4">
            {filterCustomer.map((customer) => (
              <div
                key={customer._id}
                className={`p-2 cursor-pointer rounded-md hover:bg-gray-300 dark:hover:bg-gray-600 ${
                  selectedCustomer === customer._id
                    ? "bg-blue-500 text-white"
                    : ""
                }`}
                onClick={() => handleCustomerSelect(customer._id)}
              >
                {customer.fname} {customer.lname}
              </div>
            ))}
          </div>
        </div>

        {/* Right side: Ledger Data & Form */}
        <div className="md:w-3/4 max-h-screen h-screen overflow-y-auto ml-0 md:ml-6 bg-gray-100 dark:bg-gray-800 p-4 rounded-lg shadow-lg">
          {selectedCustomer ? (
            <>
              {/* Create Ledger Form */}
              <h2 className="text-xl font-bold mb-4">Create Ledger Entry</h2>
              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-md pb-2 font-medium dark:text-white">
                    Transaction Type
                  </label>
                  <select
                    value={transactionType}
                    onChange={(e) => setTransactionType(e.target.value)}
                    className="p-2 w-full rounded-md bg-black text-white dark:bg-black dark:text-white"
                  >
                    <option value="">Select Type</option>
                    <option value="transaction-in">Transaction In</option>
                    <option value="transaction-out">Transaction Out</option>
                  </select>
                </div>
                <div>
                  <label className="block text-md pb-2 font-medium dark:text-white">
                    Amount
                  </label>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(+e.target.value)}
                    className="p-2 w-full rounded-md bg-black text-white dark:bg-black dark:text-white"
                  />
                </div>
                <div>
                  <label className="block text-md pb-2 font-medium dark:text-white">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="p-2 ledger-inp w-full rounded-md bg-black text-white dark:bg-black dark:text-white"
                  />
                </div>
                <button
                  onClick={handleCreateLedger}
                  className="mt-4 w-full bg-blue-500 text-white p-2 rounded-md"
                >
                  Create Ledger
                </button>
              </div>

              {/* Ledger Data */}
              <div className="w-full flex justify-between items-center pb-2">
                <h2 className="text-xl font-bold mb-4 dark:text-white">
                  Ledger Entries
                </h2>
                <button
                  onClick={() =>
                    exportToExcel(
                      ledgers
                        .filter(
                          (ledger) => ledger.customer === selectedCustomer
                        )
                        .map((ledger) => {
                          if (ledger.transactionType == "transaction-in") {
                            ledger.amount = -ledger.amount;
                          }
                          return ledger;
                        }),
                      `ledger-${selectedCustomer}`
                    )
                  }
                  className="text-white bg-green-600 p-2 mt-4 "
                >
                  Download as Excel
                </button>
              </div>
              <div className="space-y-4">
                {ledgers.filter(
                  (ledger) => ledger.customer === selectedCustomer
                ).length > 0 ? (
                  ledgers
                    .filter((ledger) => ledger.customer === selectedCustomer)
                    .map((ledger) => (
                      <div
                        key={ledger._id}
                        className="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-xl transition-all duration-200 ease-in-out cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700"
                      >
                        {/* Transaction Type Icon */}
                        <div className="flex items-center justify-center bg-blue-500 dark:bg-blue-700 text-white p-2 rounded-full">
                          {/* Choose an icon based on transactionType */}
                          {ledger.transactionType === "debit" && (
                            <span className="text-xl">💸</span>
                          )}
                          {ledger.transactionType === "transaction-in" && (
                            <span className="text-xl">↗️</span>
                          )}
                          {ledger.transactionType === "transaction-out" && (
                            <span className="text-xl">↘️</span>
                          )}
                        </div>

                        <div className="ml-4 w-full flex flex-wrap justify-between items-center">
                          {/* Transaction Type */}
                          <p className="font-semibold text-lg w-1/4 text-gray-800 dark:text-white text-start">
                            {transactionTypeDisplay[ledger.transactionType] ||
                              ledger.transactionType}
                          </p>

                          {/* Amount */}
                          {ledger._id!=updateLedgerId?<p
                            className={`text-xl text-center font-bold pb-2 flex justify-center items-center w-1/4 ${
                              ledger.transactionType === "debit"
                                ? "text-red-500 dark:text-red-400"
                                : ledger.transactionType === "transaction-in"
                                ? "text-green-500 dark:text-green-400"
                                : ledger.transactionType === "transaction-out"
                                ? "text-yellow-500 dark:text-yellow-400"
                                : "text-gray-500 dark:text-gray-400" // Default color
                            }`}
                          >
                            {ledger.transactionType === "debit" && "-"}
                            {ledger.transactionType === "transaction-in" && "+"}
                            {ledger.transactionType === "transaction-out" &&
                              "-"}
                            ₹{ledger.amount}
                          </p>:<input
        type="number"
        value={uamount}
        onChange={(e) => setUAmount(e.target.value)}
        className="mt-2 w-1/4 p-2 border rounded-md dark:bg-gray-800 dark:text-white"
        placeholder="Enter new amount"
      />}

                          {/* Date */}
                          <p className="text-sm text-center text-gray-600 w-1/4 dark:text-gray-300">
                            Date: {new Date(ledger.date).toLocaleDateString()}
                          </p>
                          <div className="w-1/4 flex justify-end">
                            {updateLedgerId != ledger._id ? (
                              <button
                                className="w-fit bg-yellow-500 px-3 py-2 text-white rounded-md cursor-pointer"
                                onClick={() => {setUpdateLedgerId(ledger._id)
                                    setUAmount(ledger.amount)
                                }}
                              >
                                Update Ledger
                              </button>
                            ) : (
                              <button
                                onClick={handleSaveLedger}
                                className="w-fit bg-green-500 px-3 py-2 text-white rounded-md cursor-pointer"
                                disabled={loading}

                              >
                                {loading ? "Updating..." : "Update Ledger"}
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))
                ) : (
                  <p>No ledgers found for this customer.</p>
                )}
              </div>
            </>
          ) : (
            <p>Select a customer to view and create their ledger entries.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default LedgerComponent;
