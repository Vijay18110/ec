import React from "react";
import { motion } from "framer-motion";
import {
  FaStar,
  FaTag,
  FaBoxOpen,
  FaRulerCombined,
  FaPalette,
  FaWeight,
} from "react-icons/fa";

const ProductCard = ({ product }) => {
  const {
    name,
    brand,
    description,
    price,
    discountPrice,
    stock,
    sku,
    rating,
    attributes,
    tags,
    images,
  } = product;

  return (
    <motion.div

      whileHover={{
        y: -6,
        scale: 1, // <- Force no scaling
        boxShadow: "0 12px 25px rgba(0, 0, 0, 0.15)",
      }}
      transition={{
        type: "spring",
        stiffness: 200,
        damping: 15,
      }}
      className="card shadow-sm border-0 rounded-4 overflow-hidden h-100"
      style={{
        fontSize: "0.85rem",
        background: "#fff",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.08)",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* content */}



      {/* Product Image */}
      <div className="position-relative" >
        <img
          src={images?.[0]?.url || "https://via.placeholder.com/300x180?text=No+Image"}
          alt={name}
          className="card-img-top"
          style={{ height: "160px", objectFit: "cover" }}
          loading="lazy"
        />
        {
          product.isFeatured && (
            <span className="badge bg-warning text-dark position-absolute top-0 start-0 m-2">
              Featured
            </span>
          )
        }
        <span
          className={`badge position-absolute top-0 end-0 m-2 ${product.isActive ? "bg-success" : "bg-danger"
            }`}
          style={{ fontSize: "0.7rem" }}
        >
          {product.isActive ? "Active" : "Inactive"}
        </span>
      </div >

      {/* Product Info */}
      < div className="card-body p-3" >
        <h6 className="fw-semibold mb-1 text-truncate">{name}</h6>
        <small className="text-muted d-block mb-1">{brand}</small>

        {/* Price */}
        <div className="d-flex align-items-center justify-content-between mb-2">
          <div>
            <span className="fw-bold text-primary me-1">₹{price}</span>
            {discountPrice && (
              <small className="text-muted text-decoration-line-through">
                ₹{discountPrice}
              </small>
            )}
          </div>
          <div className="text-warning small d-flex align-items-center">
            <FaStar className="me-1" />
            {rating?.average?.toFixed(1) || "0"}{" "}
            <span className="text-muted ms-1">({rating?.count || 0})</span>
          </div>
        </div>

        {/* Attributes */}
        {
          attributes && (
            <div className="d-flex flex-wrap gap-2 small text-muted mb-2">
              {attributes.color && (
                <span className="d-flex align-items-center">
                  <FaPalette className="me-1 text-secondary" /> {attributes.color}
                </span>
              )}
              {attributes.size && (
                <span className="d-flex align-items-center">
                  <FaRulerCombined className="me-1 text-secondary" /> {attributes.size}
                </span>
              )}
              {attributes.weight && (
                <span className="d-flex align-items-center">
                  <FaWeight className="me-1 text-secondary" /> {attributes.weight}
                </span>
              )}
            </div>
          )
        }

        {/* Description */}
        <p
          className="text-muted mb-2"
          style={{
            fontSize: "0.75rem",
            height: "38px",
            overflow: "hidden",
          }}
        >
          {description}
        </p>

        {/* Tags */}
        {
          tags && tags.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {tags.slice(0, 3).map((tag, i) => (
                <span
                  key={i}
                  className="badge bg-light text-dark border border-secondary-subtle fw-normal"
                >
                  <FaTag className="me-1" />
                  {tag}
                </span>
              ))}
            </div>
          )
        }

        {/* Stock Info */}
        {/* <div className="d-flex justify-content-between align-items-center small text-muted">
          <span>
            <FaBoxOpen className="me-1 text-secondary" />
            {stock} in stock
          </span>
          <span>SKU: {sku}</span>
        </div> */}
      </div >
    </motion.div >
  );
};

export default ProductCard;
