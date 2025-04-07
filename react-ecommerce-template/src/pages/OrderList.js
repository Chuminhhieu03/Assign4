// src/pages/OrderList.js
import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./OrderList.css";

function OrderList() {
  const [orders, setOrders] = useState([]);
  const token = useSelector((state) => state.token);
  const history = useHistory();

  useEffect(() => {
    const fetchOrders = async () => {
      if (token === "") return;
      const response = await fetch(
        "http://localhost:8080/api/order/getOrder/",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const data = await response.json();
      console.log(data);
      setOrders(data);
    };

    fetchOrders();
  }, [token]);

  const convertDate = (date) => {
    // format dd-MM-yyyy
    const d = new Date(date);
    const year = d.getFullYear();
    const month = `0${d.getMonth() + 1}`.slice(-2);
    const day = `0${d.getDate()}`.slice(-2);
    return `${day}-${month}-${year}`;
  };

  const viewDetail = (id) => {
    history.push(`/order/details/${id}`);
  };

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <h2 className="mb-4">My Orders</h2>
      {orders.length === 0 ? (
        <div className="alert alert-info" role="alert">
          You have no orders.
        </div>
      ) : (
        <div className="order-list">
          {orders.map((order) => (
            <div className="order-item" key={order.order_id}>
              <h5>Order ID: {order.order_id}</h5>
              <p>Date: {convertDate(order.order_date)}</p>
              <p>
                Status: {order.order_status == true ? "Succees" : "Is Ready"}
              </p>
              <p>Shipping Address: {order.order_address}</p>
              <p>Payment Method: {order.order_payment}</p>
              <p>Shipping Method: {order.order_shipment}</p>
              <p>Total: ${order.order_total}</p>
              <div className="order-products">
                {order.order_cart.map((item) => (
                  <div className="order-product" key={item.cart_id}>
                    <img
                      src={item.cart_image}
                      alt={item.cart_name}
                      className="order-product-image"
                    />
                    <div className="order-product-details">
                      <h6>{item.cart_name}</h6>
                      <p>Quantity: {item.cart_quantity}</p>
                      <p>Price: ${item.cart_price}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default OrderList;
