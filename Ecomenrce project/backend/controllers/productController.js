const Product = require("../models/productSchema");
const Customer = require("../models/customerSchema");
const Seller = require("../models/sellerSchema");  // Add this import

const productCreate = async (req, res) => {
    try {
        const product = new Product(req.body)

        let result = await product.save();

        res.send(result);
    } catch (err) {
        res.status(500).json(err);
    }
};


const getSellerProducts = async (req, res) => {
    try {
        let products = await Product.find({ seller: req.params.id })
        if (products.length > 0) {
            res.send(products)
        } else {
            res.send({ message: "No products found" });
        }
    } catch (err) {
        res.status(500).json(err);
    }
};


const updateProduct = async (req, res) => {
    try {
        let result = await Product.findByIdAndUpdate(req.params.id,
            { $set: req.body },
            { new: true })

        res.send(result)
    } catch (error) {
        res.status(500).json(error);
    }
}

const addReview = async (req, res) => {
    try {
        const { rating, comment, reviewer } = req.body;
        
        // Validate required fields
        if (!rating || !comment || !reviewer) {
            return res.status(400).json({ 
                message: "Rating, comment and reviewer are required" 
            });
        }

        const productId = req.params.id;

        // Check if product exists
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ 
                message: "Product not found" 
            });
        }

        // Check for existing review
        const existingReview = product.reviews.find(
            review => review.reviewer.toString() === reviewer
        );

        if (existingReview) {
            return res.status(400).json({ 
                message: "You have already submitted a review for this product." 
            });
        }

        // Add the new review
        product.reviews.push({
            rating,
            comment,
            reviewer,
            date: new Date(),
        });

        const updatedProduct = await product.save();
        res.status(200).json(updatedProduct);
        
    } catch (error) {
        // Check if error is due to invalid ObjectId
        if (error.name === 'CastError') {
            return res.status(400).json({ 
                message: "Invalid product ID format" 
            });
        }
        res.status(500).json({ 
            message: "Error adding review",
            error: error.message 
        });
    }
    
};

const getProducts = async (req, res) => {
    try {
        const products = await Product.find().populate("seller", "shopName");
        res.status(200).json(products.length > 0 ? products : { message: "No products found" });
    } catch (err) {
        res.status(500).json({ 
            message: "Error fetching products",
            error: err.message 
        });
    }
};

const getProductDetail = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(req.params.id)
            .populate("seller", "shopName")
            .populate({
                path: "reviews.reviewer",
                model: "customer",
                select: "name"
            });

        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        res.status(200).json(product);
    } catch (err) {
        if (err.name === 'CastError') {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        res.status(500).json({ 
            message: "Error fetching product details",
            error: err.message 
        });
    }
};

const searchProduct = async (req, res) => {
    try {
        const key = req.params.key;
        if (!key) {
            return res.status(400).json({ message: "Search key is required" });
        }

        const products = await Product.find({
            $or: [
                { productName: { $regex: key, $options: 'i' } },
                { category: { $regex: key, $options: 'i' } },
                { subcategory: { $regex: key, $options: 'i' } }
            ]
        }).populate("seller", "shopName");

        res.status(200).json(products.length > 0 ? products : { message: "No products found" });
    } catch (err) {
        res.status(500).json({ 
            message: "Error searching products",
            error: err.message 
        });
    }
};

const searchProductbyCategory = async (req, res) => {
    try {
        const key = req.params.key;
        if (!key) {
            return res.status(400).json({ message: "Category key is required" });
        }

        const products = await Product.find({
            category: { $regex: key, $options: 'i' }
        }).populate("seller", "shopName");

        res.status(200).json(products.length > 0 ? products : { message: "No products found" });
    } catch (err) {
        res.status(500).json({ 
            message: "Error searching products by category",
            error: err.message 
        });
    }
};

const deleteProduct = async (req, res) => {
    try {
        if (!req.params.id) {
            return res.status(400).json({ message: "Product ID is required" });
        }

        const product = await Product.findById(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product not found" });
        }

        const deletedProduct = await Product.findByIdAndDelete(req.params.id);

        // If there's a Customer model and we need to update cart details
        if (Customer) {
            try {
                await Customer.updateMany(
                    { "cartDetails._id": deletedProduct._id },
                    { $pull: { cartDetails: { _id: deletedProduct._id } } }
                );
            } catch (cartError) {
                console.error("Error updating customer carts:", cartError);
                // Continue with deletion even if cart update fails
            }
        }

        res.status(200).json({
            message: "Product deleted successfully",
            deletedProduct
        });
    } catch (error) {
        if (error.name === 'CastError') {
            return res.status(400).json({ message: "Invalid product ID format" });
        }
        res.status(500).json({ 
            message: "Error deleting product",
            error: error.message 
        });
    }
};

module.exports = {
    productCreate,
    getSellerProducts,
    updateProduct,
    addReview,
    getProducts,
    getProductDetail,
    searchProduct,
    searchProductbyCategory,
    deleteProduct
};