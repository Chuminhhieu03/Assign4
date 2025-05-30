import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";

function Header() {
  const [openedDrawer, setOpenedDrawer] = useState(false);
  const name = useSelector((state) => state.name);

  function toggleDrawer() {
    setOpenedDrawer(!openedDrawer);
  }

  function changeNav(event) {
    if (openedDrawer) {
      setOpenedDrawer(false);
    }
  }

  return (
    <header>
      <nav className="navbar fixed-top navbar-expand-lg navbar-light bg-red border-bottom">
        <div className="container-fluid">
          <Link className="navbar-brand" to="/" onClick={changeNav}>
            <FontAwesomeIcon
              icon={["fab", "shopify"]}
              className="ms-1"
              size="lg"
            />
            <span className="ms-2 h5">Eccomerce</span>
          </Link>
          {name && (
            <div
              className={
                "navbar-collapse offcanvas-collapse " +
                (openedDrawer ? "open" : "")
              }
            >
              <ul className="navbar-nav me-auto mb-lg-0">
                <li className="nav-item">
                  <Link
                    to="/products"
                    className="nav-link"
                    replace
                    onClick={changeNav}
                  ></Link>
                </li>
              </ul>
              <button
                type="button"
                className="btn btn-outline-dark me-3 d-none d-lg-inline"
              >
                <Link to="/cart" className="">
                  <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
                </Link>
                <span className="ms-3 badge rounded-pill bg-dark">Cart</span>
              </button>
              <ul className="navbar-nav mb-2 mb-lg-0">
                <li className="nav-item dropdown">
                  <a
                    href="!#"
                    className="nav-link dropdown-toggle"
                    data-toggle="dropdown"
                    id="userDropdown"
                    role="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    <FontAwesomeIcon icon={["fas", "user-alt"]} />
                  </a>
                  <ul
                    className="dropdown-menu dropdown-menu-end"
                    aria-labelledby="userDropdown"
                  >
                    <li>
                      {!name && (
                        <Link
                        to="/login"
                        className="dropdown-item"
                        onClick={changeNav}
                      >
                        Login
                      </Link>
                      )}
                      <Link
                        to="/orders"
                        className="dropdown-item"
                        onClick={changeNav}
                      >
                        Orders
                      </Link>
                    </li>
                  </ul>
                </li>
              </ul>
            </div>
          )}

          <div className="d-inline-block d-lg-none">
            <button type="button" className="btn btn-outline-dark">
              <FontAwesomeIcon icon={["fas", "shopping-cart"]} />
              <span className="ms-3 badge rounded-pill bg-dark">0</span>
            </button>
            <button
              className="navbar-toggler p-0 border-0 ms-3"
              type="button"
              onClick={toggleDrawer}
            >
              <span className="navbar-toggler-icon"></span>
            </button>
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Header;
