// routes/customerRoutes.js
import express from 'express';
import { createCustomer, getCustomerBySearch, getCustomers, updateProduct, deleteProduct } from '../controllers/customer.controller.js';
const router = express.Router();
import { isAdmin } from "../middleware/auth.js";
import { verifyToken } from '../utils/verifyUser.js';


router.get('/', verifyToken, isAdmin, getCustomers);
router.post('/create', verifyToken, isAdmin, createCustomer);
router.post('/search', verifyToken, isAdmin, getCustomerBySearch);
router.put('/product/:id', verifyToken, isAdmin, updateProduct);
router.delete('/product/:id', verifyToken, isAdmin, deleteProduct);


export default router;