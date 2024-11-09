// routes/customerRoutes.js
import express from 'express';
import { createCustomer, getCustomerBySearch, getCustomers } from '../controllers/customer.controller.js';
const router = express.Router();

router.get('/', getCustomers);
router.post('/create', createCustomer);
router.post('/search', getCustomerBySearch);


export default router;