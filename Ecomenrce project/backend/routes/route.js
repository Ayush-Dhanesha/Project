const router = require('express').Router();


const {
    productCreate,
    getSellerProducts,
    updateProduct,
    addReview,
    getProducts,
    getProductDetail,
    searchProduct,
    searchProductbyCategory,
    deleteProduct
} = require('../controllers/productController.js');


// Product
router.post('/ProductCreate', productCreate);
router.get('/getSellerProducts/:id', getSellerProducts);


router.put('/ProductUpdate/:id', updateProduct);
router.put('/addReview/:id', addReview);

router.get('/getProducts', getProducts);
router.get('/getProductDetail/:id', getProductDetail);
router.get('/searchProduct/:key', searchProduct);
router.get('/searchProductbyCategory/:key', searchProductbyCategory);
router.delete('/DeleteProduct/:id', deleteProduct);


module.exports = router;