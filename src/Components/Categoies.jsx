import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const CategoryList = ({ categories }) => {
    const navigate = useNavigate();

    return (
        <div className="">
            <div className="h4 mb-4 fw-bold text-uppercase">Shop By Category</div>
            <div className=" d-flex flex-wrap">
                {[...categories, ...categories, ...categories].reverse
                    ().map((cat, index) => (
                        <div key={index} className="">
                            <motion.div
                                className="  position-relative my-1"
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                whileHover={{ scale: 1.1, y: -5 }}
                                transition={{ duration: 0.35 }}
                                onClick={() => navigate(`/category/${cat.slug}`)}
                                style={{ cursor: "pointer", width: 140 }}
                            >
                                {/* Circular Image */}
                                <div
                                    className="rounded-3 overflow-hidden border border-light-subtle shadow-sm"
                                    style={{
                                        width: 120,
                                        height: 120,
                                        boxShadow: "0 6px 14px rgba(0,0,0,0.08)",
                                        background: "rgba(0,0,0,0.08)"
                                    }}
                                >
                                    <img
                                        src={cat.image}
                                        alt={cat.name}
                                        loading="lazy"
                                        width={"90%"}
                                        height={"90%"}
                                        className="w-100 h-100 object-fit-cover"
                                    />
                                </div>

                                {/* Category Name */}
                                <motion.div
                                    className="mt-1 fw-semibold text-dark"
                                    whileHover={{ color: "#0d6efd" }}
                                >
                                    {cat.name}
                                </motion.div>

                                {/* Hover Gradient */}
                                <motion.div
                                    className="position-absolute top-0 start-0 w-100 h-100 rounded-circle"
                                    style={{
                                        opacity: 0,
                                        background: "radial-gradient(circle at center, rgba(13,110,253,0.1), transparent 70%)",
                                    }}
                                    whileHover={{ opacity: 1 }}
                                    transition={{ duration: 0.3 }}
                                ></motion.div>
                            </motion.div>
                        </div>
                    ))}
            </div>
        </div>
    );
};

export default CategoryList;
