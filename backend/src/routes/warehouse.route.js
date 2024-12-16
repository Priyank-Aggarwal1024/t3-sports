import express from "express";
import { getAllWarehouses } from "../controllers/warehouseController.js";
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllWarehouses);

export default router;
