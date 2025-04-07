import React, { useState, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import "./Admin.css";

function EditProduct() {
  const { id } = useParams();
  const history = useHistory();
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [itemType, setItemType] = useState("");
  const [author, setAuthor] = useState("");
  const [isbn, setIsbn] = useState("");
  const [size, setSize] = useState("");
  const [color, setColor] = useState("");
  const [brand, setBrand] = useState("");
  const [model, setModel] = useState("");
  const token = useSelector((state) => state.token);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:8080/item/getItemById?id=${id}`
      );
      const data = await response.json();
      setName(data.name);
      setPrice(data.price);
      setDescription(data.description);
      setItemType(data.itemType);
      if (data.itemType === "Book") {
        setAuthor(data.author);
        setIsbn(data.isbn);
      } else if (data.itemType === "Clothes") {
        setSize(data.size);
        setColor(data.color);
      } else if (data.itemType === "Electronic") {
        setBrand(data.brand);
        setModel(data.model);
      }
    };

    fetchProduct();
  }, [id]);

  const handleEditProduct = async (e) => {
    e.preventDefault();
    let url = "";
    let body = {};

    if (itemType === "Book") {
      url = "http://localhost:8080/item/updateBook";
      body = { id, name, price, description, author, isbn };
    } else if (itemType === "Clothes") {
      url = "http://localhost:8080/item/updateClothes";
      body = { id, name, price, description, size, color };
    } else if (itemType === "Electronic") {
      url = "http://localhost:8080/item/updateElectronic";
      body = { id, name, price, description, brand, model };
    }

    const response = await fetch(url, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (response.ok) {
      alert("Product updated successfully");
      history.push("/admin/dashboard");
    } else {
      alert("Failed to update product");
    }
  };

  return (
    <div className="edit-product">
      <h1>Edit Product</h1>
      <form onSubmit={handleEditProduct}>
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
            <input
              type="text"
              value={brand}
              onChange={(e) => setBrand(e.target.value)}
              placeholder="Brand"
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

        <button type="submit">Update Product</button>
      </form>
    </div>
  );
}

export default EditProduct;
