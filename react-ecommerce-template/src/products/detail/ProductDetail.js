import RelatedProduct from "./RelatedProduct";
import Ratings from "react-ratings-declarative";
import { Link } from "react-router-dom";
import ScrollToTopOnMount from "../../template/ScrollToTopOnMount";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom/cjs/react-router-dom.min";
import "./ProductDetail.css";
import { useSelector } from "react-redux";

const iconPath =
  "M18.571 7.221c0 0.201-0.145 0.391-0.29 0.536l-4.051 3.951 0.96 5.58c0.011 0.078 0.011 0.145 0.011 0.223 0 0.29-0.134 0.558-0.458 0.558-0.156 0-0.313-0.056-0.446-0.134l-5.011-2.634-5.011 2.634c-0.145 0.078-0.29 0.134-0.446 0.134-0.324 0-0.469-0.268-0.469-0.558 0-0.078 0.011-0.145 0.022-0.223l0.96-5.58-4.063-3.951c-0.134-0.145-0.279-0.335-0.279-0.536 0-0.335 0.346-0.469 0.625-0.513l5.603-0.815 2.511-5.078c0.1-0.212 0.29-0.458 0.547-0.458s0.446 0.246 0.547 0.458l2.511 5.078 5.603 0.815c0.268 0.045 0.625 0.179 0.625 0.513z";

function ProductDetail() {
  const token = useSelector((state) => state.token);
  const [product, setProduct] = useState({});
  const [rating, setRating] = useState(0);
  const [relatedProduct, setRelatedProduct] = useState([]);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const idParam = useParams().id;

  function changeRating(newRating) {
    fetch("http://localhost:8080/feel/rating", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemId: idParam,
        rating: newRating,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        alert("Rating added successfully");
        getRating();
      });
  }

  const getRating = () => {
    fetch(`http://localhost:8080/feel/getRating?itemId=${idParam}`, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        // Trung binh cong
        console.log("rating: ", data);
        let sum = 0;
        data.forEach((item) => {
          sum += item.value;
        });
        if (data.length === 0) setRating(0);
        setRating(sum / data.length);
      });
  };

  const addComment = () => {
    if (newComment === "") return;
    fetch("http://localhost:8080/feel/comment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        itemId: idParam,
        content: newComment,
      }),
    })
      .then((response) => response.json())
      .then((data) => {
        console.log(data);
        setComments([...comments, data]);
      });
  };
  useEffect(() => {
    fetch(`http://localhost:8080/api/item/getItemById/?id=${idParam}`)
      .then((response) => response.json())
      .then((data) => {
        setProduct(data);
      });
    // fetch(`http://localhost:8080/feel/getComment?itemId=${idParam}`)
    //   .then((response) => response.json())
    //   .then((data) => {
    //     console.log(data);
    //     setComments(data);
    //   });
    // getRating();
  }, [idParam]);

  useEffect(() => {
    fetch(
      `http://localhost:8080/api/item/getAllItems/?item_type=${product.type}`
    )
      .then((response) => response.json())
      .then((data) => {
        // Random 4 products
        data.items = data.items.sort(() => Math.random() - 0.5).slice(0, 4);
        setRelatedProduct(data.items);
      });
  }, [product]);

  return (
    <div className="container mt-5 py-4 px-xl-5">
      <ScrollToTopOnMount />
      <nav aria-label="breadcrumb" className="bg-custom-light rounded mb-4">
        <ol className="breadcrumb p-3">
          <li className="breadcrumb-item">
            <Link
              className="text-decoration-none link-secondary"
              to="/products"
            >
              All Prodcuts
            </Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {product.name}
          </li>
        </ol>
      </nav>
      <div className="row mb-4">
        <div className="col-lg-6">
          <div className="row">
            <div className="col-12 mb-4">
              <img
                className="border rounded ratio ratio-1x1"
                alt=""
                src={product.image}
              />
            </div>
          </div>
        </div>

        <div className="col-lg-5">
          <div className="d-flex flex-column h-100">
            <h2 className="mb-1">{product.name}</h2>
            <h4 className="text-muted mb-4">{product.price} $</h4>

            <div className="row g-3 mb-4">
              <div className="col">
                <button className="btn btn-outline-dark py-2 w-100">
                  Add to cart
                </button>
              </div>
            </div>

            <h4 className="mb-0">Details</h4>
            <hr />
            <dl className="row">
              <dt className="col-sm-4">Code</dt>
              <dd className="col-sm-8 mb-3">{product._id}</dd>

              <dt className="col-sm-4">Category</dt>
              <dd className="col-sm-8 mb-3">{product.type}</dd>

              {product.author && (
                <>
                  <dt className="col-sm-4">Author</dt>
                  <dd className="col-sm-8 mb-3">{product.author}</dd>
                </>
              )}

              {product.isbn && (
                <>
                  <dt className="col-sm-4">ISBN</dt>
                  <dd className="col-sm-8 mb-3">{product.isbn}</dd>
                </>
              )}

              {product.size && (
                <>
                  <dt className="col-sm-4">Size</dt>
                  <dd className="col-sm-8 mb-3">{product.size}</dd>
                </>
              )}

              {product.color && (
                <>
                  <dt className="col-sm-4">Color</dt>
                  <dd className="col-sm-8 mb-3">{product.color}</dd>
                </>
              )}

              {product.brand && (
                <>
                  <dt className="col-sm-4">Brand</dt>
                  <dd className="col-sm-8 mb-3">{product.brand}</dd>
                </>
              )}

              {product.model && (
                <>
                  <dt className="col-sm-4">Model</dt>
                  <dd className="col-sm-8 mb-3">{product.model}</dd>
                </>
              )}

              {/* <dt className="col-sm-4">Rating</dt>
              <dd className="col-sm-8 mb-3">
                <Ratings
                  rating={rating ? rating : 0}
                  widgetRatedColors="rgb(253, 204, 13)"
                  changeRating={changeRating}
                  widgetSpacings="2px"
                >
                  {Array.from({ length: 5 }, (_, i) => {
                    return (
                      <Ratings.Widget
                        key={i}
                        widgetDimension="20px"
                        svgIconViewBox="0 0 19 20"
                        svgIconPath={iconPath}
                        widgetHoverColor="rgb(253, 204, 13)"
                      />
                    );
                  })}
                </Ratings>
              </dd> */}
            </dl>

            <h4 className="mb-0">Description</h4>
            <hr />
            <p className="lead flex-shrink-0">
              <small>{product.description}</small>
            </p>
          </div>
        </div>
      </div>

      <div className="row">
        <div className="col-md-12 mb-4">
          <hr />
          <h4 className="text-muted my-4">Related products</h4>
          <div className="row row-cols-1 row-cols-md-3 row-cols-lg-4 g-3">
            {relatedProduct?.map((product, i) => (
              <RelatedProduct key={i} {...product} />
            ))}
          </div>
        </div>
      </div>
      {/* <div className="row">
        <div className="col-md-12">
          <hr />
          <h4 className="text-muted my-4">Comments</h4>
          <div className="comments-section">
            {comments.map((comment, index) => (
              <div key={index} className="comment">
                <p>
                  <strong>{comment.customer.name}</strong> - {comment.date}
                </p>
                <p>{comment.content}</p>
              </div>
            ))}
          </div>
          <div className="add-comment">
            <textarea
              className="form-control"
              rows="3"
              placeholder="Add a comment"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
            ></textarea>
            <button
              className="btn btn-primary mt-2"
              onClick={() => addComment()}
            >
              Add Comment
            </button>
          </div>
        </div>
      </div> */}
    </div>
  );
}

export default ProductDetail;
