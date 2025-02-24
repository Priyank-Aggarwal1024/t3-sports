const Collection = require("../models/collection.model.js");
const Product = require("../models/product.model.js");
const Warehouse = require("../models/Warehouse.model.js");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      specifications,
      size,
      price,
      images,
      sizeChart,
      category,
      collection,
    } = req.body;
    // console.log(req.body)
    const newProduct = new Product({
      name,
      description,
      specifications,
      size,
      price: Number(price),
      images,
      sizeChart,
      category,
    });
    await newProduct.save();
    console.log(collection);
    if (collection) {
      const coll = await Collection.findById(collection);
      if (coll) {
        coll.products.push(newProduct._id);
        await coll.save();
      }
    }
    return res.status(201).json({
      success: true,
      message: "Product created successfully",
      product: newProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProducts = async (req, res) => {
  try {
    const products = await Product.find();
    return res.status(200).json({ success: true, products });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({ success: true, product });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const updateProduct = async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Product updated",
      product: updatedProduct,
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const deletedProduct = await Product.findByIdAndDelete(req.params.id);

    if (!deletedProduct) {
      return res
        .status(404)
        .json({ success: false, message: "Product not found" });
    }
    await Warehouse.updateMany(
      { "products.productId": req.params.id }, // Find warehouses where the product is referenced
      { $pull: { products: { productId: req.params.id } } } // Remove the product from the array
    );

    return res.status(200).json({ success: true, message: "Product deleted" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
module.exports = {
  createProduct,
  deleteProduct,
  getProductById,
  getProducts,
  updateProduct,
};
