const mongoose = require("mongoose");
const Customer = require("../models/customer.model.js");
const Ledger = require("../models/ledger.model.js");

// Create a new ledger entry
const createLedger = async (req, res) => {
  const { transactionType, customer, amount, date } = req.body;

  try {
    // Check if the customer exists in the database
    const existingCustomer = await Customer.findById(customer);
    if (!existingCustomer) {
      return res.status(404).json({
        success: false,
        message: "Customer not found. Please provide a valid customer ID.",
      });
    }

    // Create a new ledger entry
    const ledgerDate = date || new Date().toISOString(); // If no date is provided, use the current date

    const ledgerEntry = new Ledger({
      transactionType,
      customer,
      amount,
      date: ledgerDate,
    });

    // Save the ledger entry to the database
    await ledgerEntry.save();

    // Respond with the created ledger entry
    return res.status(201).json({
      success: true,
      message: "Ledger entry created successfully.",
      ledger: ledgerEntry,
    });
  } catch (error) {
    console.error("Error creating ledger entry:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while creating the ledger entry. Please try again later.",
    });
  }
};

const updateLedger = async (req, res) => {
  try {
    const { id } = req.params; // Ledger ID
    const { amount } = req.body;

    // ✅ Check if ledger ID format is valid
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: "Invalid ledger ID format.",
      });
    }

    // ✅ Check if ledger entry exists
    const existingLedger = await Ledger.findById(id);
    if (!existingLedger) {
      return res.status(404).json({
        success: false,
        message: "Ledger entry not found.",
      });
    }
    if (amount !== undefined && (isNaN(amount) || amount <= 0)) {
      return res.status(400).json({
        success: false,
        message: "Amount must be a valid positive number.",
      });
    }
    const updateData = {
      amount,
    };

    // ✅ Update ledger entry
    const updatedLedger = await Ledger.findByIdAndUpdate(id, updateData, {
      new: true,
    });

    return res.status(200).json({
      success: true,
      message: "Ledger entry updated successfully.",
      ledger: updatedLedger,
    });
  } catch (error) {
    console.error("Error updating ledger entry:", error);

    return res.status(500).json({
      success: false,
      message:
        "An error occurred while updating the ledger entry. Please try again later.",
      error: error.message,
    });
  }
};

// Get all ledger entries
const getAllLedgers = async (req, res) => {
  try {
    // Fetch all ledger entries, populate the customer field
    const ledgers = await Ledger.find().sort({ date: -1 }); // Sort by date in descending order (most recent first)

    // If no ledgers are found
    if (ledgers.length === 0) {
      return res.status(404).json({
        success: false,
        message:
          "No ledger entries found. Please ensure there are ledger entries in the system.",
      });
    }

    // Respond with the list of ledgers
    return res.status(200).json({
      success: true,
      message: "Ledger entries fetched successfully.",
      ledgers,
    });
  } catch (error) {
    console.error("Error fetching ledgers:", error);
    return res.status(500).json({
      success: false,
      message:
        "An error occurred while fetching ledger entries. Please try again later.",
    });
  }
};
module.exports = { createLedger, getAllLedgers, updateLedger };
