var express = require('express');
var router = express.Router();
const orderController = require('../controllers/orderController');
const authenticateToken = require('../util/middleware/authMiddleware')

router.post('/postorder', authenticateToken, orderController.postOrder)
router.post('/getcustomerorders',authenticateToken, orderController.getOrdersByCustomerId)

module.exports = router;