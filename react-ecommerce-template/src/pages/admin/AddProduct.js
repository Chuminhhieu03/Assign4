import React, { useState } from "react";
import { useSelector } from "react-redux";
import "./Admin.css";

function AddProduct() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("Book");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const token = useSelector((state) => state.token);

  const handleAddProduct = async (e) => {
    e.preventDefault();
    let url = "";
    let body = {};

    if (itemType === "Book") {
      url = "http://localhost:8080/item/addBook";
      body = { name, price, description, author, isbn };
    } else if (itemType === "Clothes") {
      url = "http://localhost:8080/item/addClothes";
      body = { name, price, description, size, color, brand };
    } else if (itemType === "Electronic") {
      url = "http://localhost:8080/item/addElectronic";
      body = { name, price, description, brand, model };
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Product added successfully");
    } else {
      alert("Failed to add product");
    }
  };

  return (
    <div className="add-product">
      <h1>Add New Product</h1>
      <form onSubmit={handleAddProduct}>
        <select value={itemType} onChange={(e) => setItemType(e.target.value)}>
          <option value="Book">Book</option>
          <option value="Clothes">Clothes</option>
          <option value="Electronic">Electronic</option>
        </select>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Product Name"
        />
        <input
          type="text"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Product Price"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Product Description"
        ></textarea>

        {itemType === "Book" && (
          <>
            <input
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Author"
            />
            <input
              type="text"
              value={isbn}
              onChange={(e) => setIsbn(e.target.value)}
              placeholder="ISBN"
            />
          </>
        )}

        {itemType === "Clothes" && (
          <>
            <input
              type="text"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              placeholder="Size"
            />
            <input
              type="text"
              value={color}
              onChange={(e) => setColor(e.target.value)}
              placeholder="Color"
            />
          </>
        )}

        {itemType === "Electronic" && (
          <>
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand"
            />
            <input
              type="text"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              placeholder="Model"
            />
          </>
        )}

        <button type="submit">Add Product</button>
      </form>
    </div>
  );
}

export default AddProduct;
