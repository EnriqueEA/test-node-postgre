const { Router } = require('express');
const router = Router();

const { getCustomers, createCustomer, updateCustomerById, deleteCustomer, getCustomersById } = require('../controllers/index.controller');

router.get('/api/v1/clientes', getCustomers);
router.get('/api/v1/clientes/:uuid', getCustomersById);
router.post('/api/v1/clientes/registro', createCustomer);
router.post('/api/v1/clientes/:uuid', updateCustomerById);
router.delete('/api/v1/clientes/:uuid', deleteCustomer);

module.exports = router;