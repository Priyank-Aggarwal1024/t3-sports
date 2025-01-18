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
    }, size: {
        type: String,
        required: true
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
    category: {
        type: String,
        required: [true, 'Category is required'],
        maxlength: [100, 'Category cannot exceed 100 characters']
    }
}, { timestamps: true });

const Product = mongoose.model('Product', ProductSchema);
export default Product;
