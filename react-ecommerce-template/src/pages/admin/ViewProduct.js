import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import "./ViewProduct.css";

function ViewProduct() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [rating, setRating] = useState(0);

  useEffect(() => {
    const fetchProduct = async () => {
      const response = await fetch(
        `http://localhost:8080/item/getItemById?id=${id}`
      );
      const data = await response.json();
      setProduct(data);
    };

    const fetchRating = async () => {
      const response = await fetch(
        `http://localhost:8080/feel/getRating?itemId=${id}`
      );
      const data = await response.json();
      if (data.length === 0) setRating(0);
      else {
        let sum = 0;
        data.forEach((item) => {
          sum += item.value;
        });
        setRating(sum / data.length);
      }
    };

    fetchProduct();
    fetchRating();
  }, [id]);

  if (!product) {
    return <div>Loading...</div>;
  }

  return (
    <div className="view-product">
      <h1>{product.name}</h1>
      <p>
        <strong>Price:</strong> {product.price}
      </p>
      <p>
        <strong>Code:</strong> {product.id}
      </p>
      <p>
        <strong>Category:</strong> {product.itemType}
      </p>
      {product.itemType === "Book" && (
        <div className="category-info">
          <p>
            <strong>Author:</strong> {product.author}
          </p>
          <p>
            <strong>ISBN:</strong> {product.isbn}
          </p>
        </div>
      )}
      {product.itemType === "Clothes" && (
        <div className="category-info">
          <p>
            <strong>Size:</strong> {product.size}
          </p>
          <p>
            <strong>Color:</strong> {product.color}
          </p>
        </div>
      )}
      {product.itemType === "Electronic" && (
        <div className="category-info">
          <p>
            <strong>Brand:</strong> {product.brand}
          </p>
          <p>
            <strong>Model:</strong> {product.model}
          </p>
        </div>
      )}
      <div className="rating">
        <p>
          <strong>Rating:</strong> {rating}/5 point
        </p>
      </div>
    </div>
  );
}

export default ViewProduct;
