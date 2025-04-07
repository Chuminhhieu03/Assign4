import { Link } from "react-router-dom";

function RelatedProduct(props) {
  const { id, name, price, image } = props;

  let offPrice = `${price} $`;

  return (
    <Link
      to={`/products/${id}`}
      className="col text-decoration-none"
      replace
    >
      <div className="card shadow-sm">
        <img
          className="card-img-top bg-dark cover"
          height="200"
          alt=""
          src={image}
        />
        <div className="card-body">
          <h5 className="card-title text-center text-dark text-truncate">
            {name}
          </h5>
          <p className="card-text text-center text-muted">{offPrice}</p>
        </div>
      </div>
    </Link>
  );
}

export default RelatedProduct;
