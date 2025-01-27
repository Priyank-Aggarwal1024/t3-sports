import express from "express";
import { getUsers, getUser, getUserById, deleteUser } from "../controllers/user.controller.js";
import { verifyToken } from "../utils/verifyUser.js";
import { isAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/get-users", isAdmin, getUsers);
router.get("/get-user/:email", getUser);
router.get("/get-user-by-id/:id", getUserById);
router.delete("/delete/:id", verifyToken, isAdmin, deleteUser);

export default router;
