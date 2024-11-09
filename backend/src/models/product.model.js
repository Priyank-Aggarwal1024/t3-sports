import mongoose from "mongoose";


const ProductSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true },
    image: { type: String },
    description: { type: String },
    category: { type: String },
    subcategory: { type: String }
  }, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;