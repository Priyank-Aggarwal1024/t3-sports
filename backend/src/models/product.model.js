// import mongoose from "mongoose";


// const ProductSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     price: { type: Number, required: true },
//     quantity: { type: Number, required: true },
//     image: { type: String },
//     description: { type: String },
//     category: { type: String },
//     subcategory: { type: String }
//   }, { timestamps: true });

// const Product = mongoose.model('Product', ProductSchema);
// export default Product;


import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Product Name is required'],
        trim: true
    },
    description: {
        type: String,
        maxlength: [500, 'Product Description cannot exceed 500 characters']
    },
    specifications: {
        type: String,
        maxlength: [1000, 'Product Specifications cannot exceed 1000 characters']
    },
    size: {
        type: String,
        enum: ['Small', 'Medium', 'Large', 'Extra Large'], 
        required: [true, 'Size is required']
    },
    colour: {
        type: String,
        maxlength: [50, 'Colour cannot exceed 50 characters'],
        required: [true, 'Colour is required']
    },
    price: {
        type: Number,
        required: [true, 'Price is required'],
        min: [0, 'Price must be a positive number']
    },
    images: [{
        type: String,
        // match: [/^https?:\/\//, 'Each image must be a valid URL']
    }],
    sizeChart: {
        type: String,
        // match: [/^https?:\/\//, 'Size Chart must be a valid URL']
    },
    quantity: {
        type: Number,
        required: [true, 'Quantity is required'],
        min: [0, 'Quantity must be a positive number']
    },
    category: {
        type: String,
        required: [true, 'Category is required'],
        maxlength: [100, 'Category cannot exceed 100 characters']
    },
    subcategory: {
        type: String,
        maxlength: [100, 'Subcategory cannot exceed 100 characters']
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
