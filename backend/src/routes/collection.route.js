const express = require("express");
const {
  createCollection,
  getCollections,
  getCollectionByName,
  updateCollection,
  deleteCollection,
  removeProductFromCollection,
  addProductToCollection,
} = require("../controllers/collection.controller.js");

const router = express.Router();

// POST route to create a collection
router.post("/", createCollection);

// GET route to fetch all collections
router.get("/", getCollections);

// GET route to fetch a specific collection by name
router.get("/:name", getCollectionByName);

// PUT route to update a collection by id
router.put("/:id", updateCollection);

// DELETE route to delete a collection by id
router.delete("/:id", deleteCollection);

// Add a product to a collection
router.put("/:id/add-product", addProductToCollection);

// Remove a product from a collection
router.put("/:id/remove-product", removeProductFromCollection);

module.exports = router;
