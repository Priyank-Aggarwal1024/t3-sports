import express from "express";
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/product.controller.js";
import {isAdmin} from "../middleware/auth.js";


const router = express.Router();

// POST route to create a product
router.post("/",isAdmin, createProduct);

// GET route to fetch all products
router.get("/",getProducts);

// GET route to fetch a product by id
router.get("/:id", getProductById);

// PUT route to update a product by id
router.put("/:id",isAdmin, updateProduct);

// DELETE route to delete a product by id
router.delete("/:id",isAdmin,deleteProduct);

export default router;
