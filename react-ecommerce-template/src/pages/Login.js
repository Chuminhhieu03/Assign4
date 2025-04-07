// src/pages/Login.js
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import "./Login.css"; // Import CSS

function Login() {
  const [userName, setUserName] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const history = useHistory();

  const handleLogin = async () => {
    // Giả sử bạn có một API để đăng nhập
    const response = await fetch("http://localhost:8080/api/customer/login/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name: userName, password }),
    });

    const data = await response.json();

    if (response.ok) {
      dispatch({
        type: "SET_USER",
        payload: {
          name: data.name,
          token: data.token,
        },
      });
      history.push("/");
    } else {
      alert("Login failed");
    }
  };

  return (
    <div className="login-container">
      <div className="login-form">
        <h2>Login</h2>
        <input
          type="text"
          placeholder="Username"
          value={userName}
          onChange={(e) => setUserName(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
    </div>
  );
}

export default Login;
