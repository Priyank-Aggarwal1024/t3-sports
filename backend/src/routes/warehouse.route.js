import express from "express";
import { addProductInWarehouse, createWarehouses, deteteWarehouses, editWarehouseProductQuantity, getAllWarehouses, removeProductInWarehouse } from "../controllers/warehouseController.js";
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllWarehouses);
router.post("/create", verifyToken, isAdmin, createWarehouses);
router.put("/add-product/:id", verifyToken, isAdmin, addProductInWarehouse);
router.put("/remove-product/:id", verifyToken, isAdmin, removeProductInWarehouse);
router.delete("/:id", verifyToken, isAdmin, deteteWarehouses);
router.put("/edit-product-quantity/:id", verifyToken, isAdmin, editWarehouseProductQuantity);


export default router;
