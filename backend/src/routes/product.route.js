const express = require("express");
const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/product.controller.js");
const { isAdmin } = require("../middleware/auth.js");
const { verifyToken } = require("../utils/verifyUser.js");

const router = express.Router();

// POST route to create a product
router.post("/", verifyToken, isAdmin, createProduct);

// GET route to fetch all products
router.get("/", getProducts);

// GET route to fetch a product by id
router.get("/:id", getProductById);

// PUT route to update a product by id
router.put("/:id", verifyToken, isAdmin, updateProduct);

// DELETE route to delete a product by id
router.delete("/:id", verifyToken, isAdmin, deleteProduct);

module.exports = router;
