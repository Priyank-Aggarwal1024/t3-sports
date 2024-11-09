import express from "express";
import { signup, signin, google, signOut, updatePassword, verifyResponse } from "../controllers/auth.controller.js";
import { verifyToken } from "../utils/verifyUser.js";

const router = express.Router();

router.post("/signup", signup);
router.post("/signin", signin);
router.post("/google", google);
router.get('/signout', signOut);
router.post('/updatePassword/:email', updatePassword);
router.get('/check-token', verifyToken, verifyResponse);

export default router;
