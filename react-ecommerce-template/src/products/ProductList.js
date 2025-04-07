import { Link } from "react-router-dom";
import Product from "./Product";
import ProductH from "./ProductH";
import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import ScrollToTopOnMount from "../template/ScrollToTopOnMount";
import { useSelector, useDispatch } from "react-redux";

function FilterMenuLeft({
  itemType,
  itemTypeSelected,
  setItemTypeSelected,
  minPrice,
  maxPrice,
  setMinPrice,
  setMaxPrice,
  fetchProducts,
}) {
  return (
    <ul className="list-group list-group-flush rounded">
      <li className="list-group-item d-none d-lg-block">
        <h5 className="mt-1 mb-2">Category</h5>
        <div className="d-flex flex-wrap my-2">
          {itemType?.map((v, i) => {
            return (
              <div key={i} className="form-check form-switch me-2">
                <input
                  className="form-check-input"
                  type="checkbox" // Đổi type thành checkbox
                  id={`category-${i}`} // Sử dụng backticks cho template literals
                  value={v}
                  onChange={(e) => {
                    if (itemTypeSelected.includes(v)) {
                      // Nếu giá trị đã có trong danh sách được chọn, xóa nó
                      setItemTypeSelected(
                        itemTypeSelected.filter((item) => item !== v)
                      );
                    } else {
                      // Nếu giá trị chưa có, thêm nó vào danh sách
                      setItemTypeSelected([...itemTypeSelected, v]);
                    }
                  }}
                />
                <label
                  className="form-check-label text-capitalize"
                  htmlFor={`category-${i}`} // Sử dụng backticks cho template literals
                >
                  {v}
                </label>
              </div>
            );
          })}
        </div>
      </li>
      <li className="list-group-item">
        <h5 className="mt-1 mb-2">Price Range</h5>
        <div className="d-grid d-block mb-3">
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Min"
              name="minPrice"
              value={minPrice}
              onChange={(e) => setMinPrice(e.target.value)}
            />
            <label htmlFor="floatingInput">Min Price</label>
          </div>
          <div className="form-floating mb-2">
            <input
              type="text"
              className="form-control"
              placeholder="Max"
              name="maxPrice"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            />
            <label htmlFor="floatingInput">Max Price</label>
          </div>
          <button className="btn btn-dark" onClick={() => fetchProducts()}>
            Apply
          </button>
        </div>
      </li>
    </ul>
  );
}

function ProductList() {
  const [viewType, setViewType] = useState({ grid: true });
  const userName = useSelector((state) => state.name);
  const token = useSelector((state) => state.token);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);
  const [keySearch, setKeySearch] = useState("");
  const [itemType, setItemType] = useState(["book", "clothes", "mobile"]);
  const [itemTypeSelected, setItemTypeSelected] = useState([]);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  function changeViewType() {
    setViewType({
      grid: !viewType.grid,
    });
  }

  async function fetchProducts() {
    let url = `http://localhost:8080/api/item/getAllItems/?pageNumber=${page}&keyword=${keySearch}&`;

    // // Kiểm tra và thêm các tham số nếu chúng có giá trị
    if (itemTypeSelected) {
      url += `item_type=${itemTypeSelected}&`;
    }
    if (minPrice) {
      url += `min_price=${minPrice}&`;
    }
    if (maxPrice) {
      url += `max_price=${maxPrice}&`;
    }

    // Gọi API với URL đã xây dựng
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();
    console.log(data);
    setProducts(data.items); // Giả sử response trả về field items
    setTotalItems(data.totalRecords);
    setTotalPages(Math.ceil(data.totalRecords / 10));
  }

  useEffect(() => {
    fetchProducts();
  }, [page]);

  useEffect(() => {
    // let url = `http://localhost:8080/item/itemTypes`;
    // fetch(url)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     setItemType(data);
    //   });
  }, []);

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded">
        <ol className="breadcrumb p-3 mb-0">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none link-secondary"
              to="/products"
              replace
            >
              All Prodcuts
            </Link>
          </li>
        </ol>
      </nav>

      <div className="h-scroller d-block d-lg-none">
        <nav className="nav h-underline">
          {/* {itemType?.map((v, i) => {
            return (
              <div key={i} className="h-link me-2">
                <Link
                  to="/products"
                  className="btn btn-sm btn-outline-dark rounded-pill"
                  replace
                >
                  {v}
                </Link>
              </div>
            );
          })} */}
        </nav>
      </div>

      <div className="row mb-3 d-block d-lg-none">
        <div className="col-12">
          <div id="accordionFilter" className="accordion shadow-sm">
            <div className="accordion-item">
              <h2 className="accordion-header" id="headingOne">
                <button
                  className="accordion-button fw-bold collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target="#collapseFilter"
                  aria-expanded="false"
                  aria-controls="collapseFilter"
                >
                  Filter Products
                </button>
              </h2>
            </div>
            <div
              id="collapseFilter"
              className="accordion-collapse collapse"
              data-bs-parent="#accordionFilter"
            >
              {/* <div className="accordion-body p-0">
                <FilterMenuLeft itemType={itemType} />
              </div> */}
            </div>
          </div>
        </div>
      </div>

      <div className="row mb-4 mt-lg-3">
        <div className="d-none d-lg-block col-lg-3">
          <div className="border rounded shadow-sm">
            <FilterMenuLeft
              itemType={itemType}
              itemTypeSelected={itemTypeSelected}
              setItemTypeSelected={setItemTypeSelected}
              minPrice={minPrice}
              maxPrice={maxPrice}
              setMaxPrice={setMaxPrice}
              setMinPrice={setMinPrice}
              fetchProducts={fetchProducts}
            />
          </div>
        </div>
        <div className="col-lg-9">
          <div className="d-flex flex-column h-100">
            <div className="row mb-3">
              <div className="col-lg-9 col-xl-5 offset-xl-4 d-flex flex-row">
                <div className="input-group">
                  <input
                    className="form-control"
                    type="text"
                    placeholder="Search products..."
                    aria-label="search input"
                    value={keySearch}
                    onChange={(e) => setKeySearch(e.target.value)}
                  />
                  <button
                    className="btn btn-outline-dark"
                    onClick={() => fetchProducts()}
                  >
                    <FontAwesomeIcon icon={["fas", "search"]} />
                  </button>
                </div>
                <button
                  className="btn btn-outline-dark ms-2 d-none d-lg-inline"
                  onClick={changeViewType}
                >
                  <FontAwesomeIcon
                    icon={["fas", viewType.grid ? "th-list" : "th-large"]}
                  />
                </button>
              </div>
            </div>
            <div
              className={
                "row row-cols-1 row-cols-md-2 row-cols-lg-2 g-3 mb-4 flex-shrink-0 " +
                (viewType.grid ? "row-cols-xl-3" : "row-cols-xl-2")
              }
            >
              {products.map((product, i) => {
                if (viewType.grid) {
                  return <Product key={i} {...product} />;
                }
                return <ProductH key={i} {...product} />;
              })}
            </div>
            <div className="d-flex align-items-center mt-auto">
              <span className="text-muted small d-none d-md-inline">
                Showing 10 of {totalItems} products
              </span>
              <nav aria-label="Page navigation example" className="ms-auto">
                <ul className="pagination my-0">
                  <li className={"page-item " + (page === 1 ? "disabled" : "")}>
                    <button
                      className="page-link"
                      onClick={() => setPage(page - 1)}
                    >
                      Previous
                    </button>
                  </li>

                  {Array.from({ length: totalPages }, (_, i) => {
                    return (
                      <li
                        key={i}
                        className={
                          "page-item " + (page === i + 1 ? "active" : "")
                        }
                      >
                        <button
                          className="page-link"
                          onClick={() => setPage(i + 1)}
                        >
                          {i + 1}
                        </button>
                      </li>
                    );
                  })}

                  <li
                    className={
                      "page-item " + (page === totalPages ? "disabled" : "")
                    }
                  >
                    <button
                      className="page-link"
                      onClick={() => setPage(page + 1)}
                    >
                      Next
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductList;
