// src/pages/Cart.js
import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import "./Cart.css";

function Cart() {
  const [cart, setCart] = useState([]);
  const [listPaymentMethod, setListPaymentMethod] = useState([]);
  const [listShippingMethod, setListShippingMethod] = useState([]);
  const [shipingCost, setShipingCost] = useState(0);
  const [paymentId, setPaymentId] = useState(1);
  const [shippingId, setShippingId] = useState(1);
  const [shippingAddress, setShippingAddress] = useState("");
  const [totalCost, setTotalCost] = useState(0);

  const token = useSelector((state) => state.token);

  const fetchCart = async () => {
    if (token === "") return;
    const response = await fetch("http://localhost:8080/api/cart/list-carts/", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    const data = await response.json();
    setCart(data);
  };

  const handleRemoveFromCart = async (itemId) => {
    const response = await fetch(
      `http://localhost:8080/api/cart/deleteCart/?id=${itemId}`,
      {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (response.ok) {
      alert("Item removed from cart");
      calculateTotal();
      fetchCart();
    }
  };

  const handleIncreaseQuantity = async (itemId, quantity) => {
    const response = await fetch(`http://localhost:8080/api/cart/updateCart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId: itemId, quantity: quantity }),
    });

    if (response.ok) {
      calculateTotal();
      fetchCart();
    } else {
      alert("Failed to increase quantity");
    }
  };

  const handleDecreaseQuantity = async (itemId, quantity) => {
    if (quantity < 1) {
      alert("Quantity must be greater than 1");
      return;
    }
    const response = await fetch(`http://localhost:8080/api/cart/updateCart/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ itemId: itemId, quantity: quantity }),
    });

    if (response.ok) {
      calculateTotal();
      fetchCart();
    } else {
      alert("Failed to decrease quantity");
    }
  };

  useEffect(() => {
    const fetchPaymentMethod = async () => {
      const response = await fetch(
        "http://localhost:8080/api/order/getPayment/"
      );
      const data = await response.json();
      setListPaymentMethod(data);
    };

    const fetchShippingMethod = async () => {
      const response = await fetch(
        "http://localhost:8080/api/order/getShipment/"
      );
      const data = await response.json();
      setListShippingMethod(data);
    };

    fetchPaymentMethod();
    fetchShippingMethod();
    fetchCart();
  }, [token]);

  const calculateTotal = () => {
    var totalTemp =
      cart.reduce((total, item) => {
        return total + item.item_price * item.quantity;
      }, 0) + shipingCost;
    // setTotalCost(totalTemp);
    return totalTemp;
  };

  const createOrder = async () => {
    const response = await fetch(
      "http://localhost:8080/api/order/createOrder/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          paymentId: paymentId,
          shipmentId: shippingId,
          address: shippingAddress,
          total: totalCost,
        }),
      }
    );
    if (response.ok) {
      alert("Order created");
      fetchCart();
    } else {
      alert("Failed to create order");
    }
  };

  useEffect(() => {
    var temp = calculateTotal();
    setTotalCost(temp); // Call the calculation whenever shipping cost changes
  }, [shipingCost, cart]);

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <h2 className="mb-4">Shopping Cart</h2>
      <div className="row">
        <div className="col-lg-8">
          {cart.length === 0 ? (
            <div className="alert alert-info" role="alert">
              Your cart is empty. <Link to="/products">Go shopping</Link>
            </div>
          ) : (
            <div className="cart-items">
              {cart.map((item) => (
                <div className="cart-item" key={item.id}>
                  <img
                    src={item.item_image}
                    alt={item.item_name}
                    className="cart-item-image"
                  />
                  <div className="cart-item-details">
                    <h5>{item.item_name}</h5>
                    <p>Price: ${item.item_price}</p>
                    <div className="quantity-controls">
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          handleDecreaseQuantity(item.id, item.quantity - 1)
                        }
                      >
                        -
                      </button>
                      <span className="quantity">{item.quantity}</span>
                      <button
                        className="btn btn-outline-secondary"
                        onClick={() =>
                          handleIncreaseQuantity(item.id, item.quantity + 1)
                        }
                      >
                        +
                      </button>
                    </div>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleRemoveFromCart(item.id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="col-lg-4">
          <div className="checkout-info">
            <h4>Order Information</h4>
            <div className="form-group">
              <label htmlFor="paymentMethod">Payment Method</label>
              <select
                className="form-control"
                id="paymentMethod"
                onChange={(e) => {
                  setPaymentId(e.target.value);
                }}
              >
                {listPaymentMethod.map((method) => (
                  <option value={method.id} key={method.id}>
                    {method.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="shippingMethod">Shipping Method</label>
              <select
                className="form-control"
                id="shippingMethod"
                onChange={(e) => {
                  const selectedMethod = listShippingMethod.find(
                    (method) => method.id === parseInt(e.target.value)
                  );
                  setShipingCost(selectedMethod ? selectedMethod.price : 0);
                  setShippingId(e.target.value);
                }}
              >
                {listShippingMethod.map((method) => (
                  <option value={method.id} key={method.id}>
                    {method.name} - ${method.price}
                  </option>
                ))}
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="shippingAddress">Shipping Address</label>
              <textarea
                className="form-control"
                id="shippingAddress"
                rows="3"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              ></textarea>
            </div>
            <div className="total-price">
              <h5>Total: ${calculateTotal()}</h5>
            </div>
            <button
              className="btn btn-primary mt-3"
              onClick={() => createOrder()}
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Cart;
