var express = require('express');
var router = express.Router();
const productController = require('../controllers/productController');
const authenticateToken = require('../util/middleware/authMiddleware')

router.get('/getproducts', authenticateToken, productController.getProducts)
router.get('/filterproduct', authenticateToken, productController.filterProducts)

module.exports = router;