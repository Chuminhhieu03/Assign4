import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useSelector } from "react-redux";

function Product(props) {
  const { _id, name, price, image } = props;
  const token = useSelector((state) => state.token);

  const addCart = async () => {
    const response = await fetch("http://localhost:8080/api/cart/add/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ itemId: _id, quantity: 1 }),
    });

    const data = await response.json();

    if (response.ok) {
      alert("Product added to cart");
    } else {
      alert("Failed to add product to cart");
    }
  };
  let offPrice = `${price} $`;
  return (
    <div className="col">
      <div className="card shadow-sm">
        <Link to={`/products/${_id}`} replace>
          <img
            className="card-img-top bg-dark cover"
            height="200"
            alt=""
            src={image}
          />
        </Link>
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            {name}
          </h5>
          <p className="card-text text-center text-muted mb-0">{offPrice}</p>
          <div className="d-grid d-block">
            <button
              className="btn btn-outline-dark mt-3"
              onClick={() => addCart()}
            >
              <FontAwesomeIcon icon={["fas", "cart-plus"]} /> Add to cart
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Product;
