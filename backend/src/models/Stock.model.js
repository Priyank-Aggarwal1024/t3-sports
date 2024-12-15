import mongoose from "mongoose";

const StockSchema = new mongoose.Schema({
    warehouse: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Warehouse",
        required: true
    },
    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
        required: true
    },
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Extra Large'],
        required: true
    },
    colour: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [0, "Quantity must be a positive number"]
    }
}, { timestamps: true });

const Stock = mongoose.model("Stock", StockSchema);
export default Stock;
