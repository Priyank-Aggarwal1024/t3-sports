import mongoose from "mongoose";
// Ledger Schema
const ledgerSchema = new mongoose.Schema(
  {
    transactionType: {
      type: String,
      enum: ['debit', 'transaction-in', 'transaction-out'],
      required: true,
    },
    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Customer',
      required: true,
    },
    amount: {
      type: Number,
      required: true, // Add the amount field to store the transaction amount
    },
    date: {
      type: Date,
      default: Date.now, // Default to current date and time
    },
  },
  {
    timestamps: true, // This will add createdAt and updatedAt fields automatically
  }
);

// Create the Ledger model
const Ledger = mongoose.model('Ledger', ledgerSchema);

export default Ledger
