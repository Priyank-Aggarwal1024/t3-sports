const mongoose = require("mongoose");

const WarehouseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Warehouse name is required"],
    },
    address: {
      type: String,
      required: [true, "Warehouse address is required"],
    },
    email: {
      type: String,
      required: [true, "Warehouse email is required"],
    },
    products: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },
        quantity: {
          type: Number,
          default: 0,
        },
      },
    ],
    // admin: {
    //     type: mongoose.Schema.Types.ObjectId,
    //     ref: "User", // Assuming a User model for admins
    //     required: true
    // }
  },
  { timestamps: true }
);

const Warehouse = mongoose.model("Warehouse", WarehouseSchema);
module.exports = Warehouse;
