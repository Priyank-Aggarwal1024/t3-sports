import express from "express";
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';
import { createLedger, getAllLedgers } from "../controllers/ledger.controller.js";

const router = express.Router();

router.get("/", verifyToken, isAdmin, getAllLedgers );
router.post("/create", verifyToken, isAdmin, createLedger );

export default router;
