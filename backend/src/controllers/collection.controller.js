const Collection = require("../models/collection.model.js");
const Product = require("../models/product.model.js");

// Create a new collection
const createCollection = async (req, res) => {
  try {
    const { name, productIds } = req.body;
    await Product.find({ _id: { $in: productIds } });

    // if (!products.length) {
    //   return res.status(400).json({ success: false, message: "No valid products found" });
    // }

    const newCollection = new Collection({ name, products: productIds });
    await newCollection.save();

    res.status(201).json({
      success: true,
      message: "Collection created successfully",
      collection: newCollection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch all collections with populated products
const getCollections = async (req, res) => {
  try {
    const collections = await Collection.find().populate("products");
    res.status(200).json({ success: true, collections });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Fetch a specific collection by name with populated products
const getCollectionByName = async (req, res) => {
  try {
    const { name } = req.params;
    const collection = await Collection.findOne({ name }).populate("products");

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({ success: true, collection });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update a collection by id
const updateCollection = async (req, res) => {
  try {
    const updatedCollection = await Collection.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedCollection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    res.status(200).json({
      success: true,
      message: "Collection updated",
      collection: updatedCollection,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete a collection by id
const deleteCollection = async (req, res) => {
  try {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
      return res
        .status(404)
        .json({ success: false, message: "Collection not found" });
    }

    await Product.deleteMany({ _id: { $in: collection.products } });
    await Collection.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: "Collection and associated products deleted",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Add a product to a collection
const addProductToCollection = async (req, res) => {
  const { productId } = req.body;
  const collectionId = req.params.id;

  try {
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.products.push(productId);
    await collection.save();

    res.status(200).json({ message: "Product added to collection" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Remove a product from a collection
const removeProductFromCollection = async (req, res) => {
  const { productId } = req.body;
  const collectionId = req.params.id;

  try {
    const collection = await Collection.findById(collectionId);
    if (!collection) {
      return res.status(404).json({ message: "Collection not found" });
    }

    collection.products = collection.products.filter(
      (id) => id.toString() !== productId
    );
    await collection.save();

    res.status(200).json({ message: "Product removed from collection" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCollection,
  addProductToCollection,
  deleteCollection,
  getCollectionByName,
  getCollections,
  removeProductFromCollection,
  updateCollection,
};
