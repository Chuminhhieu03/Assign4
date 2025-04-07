import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import "./Admin.css";

function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");

  useEffect(() => {
    fetchProducts();
  }, [page]);

  const fetchProducts = async () => {
    let url = `http://localhost:8080/api/item/getAllItems/?pageNumber=${page}&keyword=${keyword}&`;

    if (minPrice) {
      url += `min_price=${minPrice}&`;
    }
    if (maxPrice) {
      url += `max_price=${maxPrice}&`;
    }

    const response = await fetch(url);
    const data = await response.json();
    setProducts(data.items);
    setTotalPages(data.totalPages);
  };

  const handleDeleteProduct = async (productId, itemType) => {
    let url = "";

    if (itemType === "Book") {
      url = `http://localhost:8080/item/deleteBook?id=${productId}`;
    } else if (itemType === "Clothes") {
      url = `http://localhost:8080/item/deleteClothes?id=${productId}`;
    } else if (itemType === "Electronic") {
      url = `http://localhost:8080/item/deleteElectronic?id=${productId}`;
    }

    const response = await fetch(url, {
      method: "DELETE",
    });

    if (response.ok) {
      alert("Product deleted successfully");
      fetchProducts();
    } else {
      alert("Failed to delete product");
    }
  };

  const handleSearch = () => {
    setPage(1);
    fetchProducts();
  };

  return (
    <div className="admin-dashboard">
      <h1>Admin Dashboard</h1>
      <Link to="/admin/add-product" className="btn btn-primary mb-3">
        Add New Product
      </Link>
      <div className="search-bar">
        <input
          type="text"
          placeholder="Search keyword"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
        />
        <button onClick={handleSearch}>Search</button>
      </div>
      <table className="table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Price</th>
            <th>Type</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => (
            <tr key={product.id}>
              <td>{product.id}</td>
              <td>{product.name}</td>
              <td>{product.price}</td>
              <td>{product.itemType}</td>
              <td>
                <Link
                  to={`/admin/view-product/${product.id}`}
                  className="btn btn-info btn-sm me-2"
                >
                  View
                </Link>
                <Link
                  to={`/admin/edit-product/${product.id}`}
                  className="btn btn-warning btn-sm me-2"
                >
                  Edit
                </Link>
                <button
                  onClick={() =>
                    handleDeleteProduct(product.id, product.itemType)
                  }
                  className="btn btn-danger btn-sm"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <nav>
        <ul className="pagination">
          <li className={"page-item " + (page === 1 ? "disabled" : "")}>
            <button className="page-link" onClick={() => setPage(page - 1)}>
              Previous
            </button>
          </li>
          {Array.from({ length: totalPages }, (_, i) => (
            <li
              key={i}
              className={"page-item " + (page === i + 1 ? "active" : "")}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}
          <li
            className={"page-item " + (page === totalPages ? "disabled" : "")}
          >
            <button className="page-link" onClick={() => setPage(page + 1)}>
              Next
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminDashboard;
