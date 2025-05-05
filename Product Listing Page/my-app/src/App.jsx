import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css';

const API_URL = 'http://localhost:5000';

function App() {
  const [cart, setCart] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${API_URL}/getProducts`);
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const addToCart = (product, quantity) => {
    const existing = cart.find((item) => item._id === product._id);
    if (existing) {
      setCart(
        cart.map((item) =>
          item._id === product._id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      );
    } else {
      setCart([...cart, { ...product, quantity }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter((item) => item._id !== id));
  };

  const updateQuantity = (id, newQty) => {
    setCart(
      cart.map((item) =>
        item._id === id ? { ...item, quantity: newQty > 0 ? newQty : 1 } : item
      )
    );
  };

  const total = cart.reduce((acc, item) => acc + item.price.cost * item.quantity, 0);

  return (
    <div className="App">
      <h1>CosmoTrinity PRODUCT CART</h1>
      <div className="listing-section">
        {products.map((product) => (
          <div className="product" key={product._id}>
            <div className="image-box">
              <div 
                className="images" 
                style={{ backgroundImage: `url(${product.productImage || `https://images.unsplash.com/photo-1596207891316-23851be3cc20?q=80&w=3435&auto=format&fit=crop`})` }}
              ></div>
            </div>
            <div className="text-box">
              <h2 className="item">{product.productName}</h2>
              <h3 className="price">${product.price.cost.toFixed(2)}</h3>
              <p className="description">{product.description}</p>
              <label htmlFor={`item-${product._id}-quantity`}>Quantity:</label>
              <input
                type="number"
                min="1"
                value={quantities[product._id] || 1}
                onChange={(e) =>
                  setQuantities((prev) => ({
                    ...prev,
                    [product._id]: parseInt(e.target.value) || 1,
                  }))
                }
              />
              <button
                onClick={() =>
                  addToCart(product, quantities[product._id] || 1)
                }
              >
                Add to Cart
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="cart-section">
        <h2>Shopping Cart</h2>
        <div className="table-heading">
          <h2 className="cart-product">Product</h2>
          <h2 className="cart-price">Price</h2>
          <h2 className="cart-quantity">Quantity</h2>
          <h2 className="cart-total">Total</h2>
        </div>
        {cart.map((item) => (
          <div className="table-content" key={item._id}>
            <div className="cart-product">
              <div className="cart-image-box">
                <div 
                  className="cart-images" 
                  style={{ backgroundImage: `url(${item.productImage || `https://images.unsplash.com/photo-1596207891316-23851be3cc20?q=80&w=3435&auto=format&fit=crop`})` }}
                ></div>
              </div>
              <h2 className="cart-item">{item.productName}</h2>
              <p className="cart-description">{item.description}</p>
            </div>
            <div className="cart-price">
              <h3 className="price">${item.price.cost.toFixed(2)}</h3>
            </div>
            <div className="cart-quantity">
              <input
                type="number"
                min="1"
                value={item.quantity}
                onChange={(e) =>
                  updateQuantity(item._id, parseInt(e.target.value) || 1)
                }
              />
            </div>
            <div className="cart-total">
              <h3 className="price">
                ${(item.price.cost * item.quantity).toFixed(2)}
              </h3>
              <button
                type="button"
                className="remove"
                onClick={() => removeFromCart(item._id)}
              >
                x
              </button>
            </div>
          </div>
        ))}

        <div className="checkout">
          <button type="button" name="checkout" id="checkout">
            Checkout
          </button>
          <div className="final-cart-total">
            <h3 className="price">${total.toFixed(2)}</h3>
          </div>
        </div>

        <div className="keep-shopping">
          <button type="button" name="keep-shopping" id="keep-shopping">
            Keep Shopping
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;

