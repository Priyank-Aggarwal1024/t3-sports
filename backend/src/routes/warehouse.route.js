import express from "express";
import { createWarehouses, deteteWarehouses, getAllWarehouses } from "../controllers/warehouseController.js";
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllWarehouses);
router.post("/create", verifyToken, isAdmin, createWarehouses);
router.delete("/:id", verifyToken, isAdmin, deteteWarehouses);

export default router;
