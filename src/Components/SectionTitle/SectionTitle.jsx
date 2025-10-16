import React from "react";
import { Link, useNavigate } from "react-router-dom";
import styles from './SectionTitle.module.css'
import { IoNavigateCircleOutline, IoNavigateSharp } from "react-icons/io5";
import { FaEye } from "react-icons/fa6";
const SectionTitle = ({ title, desc, link, id }) => {
  const navigate = useNavigate()
  const handleNavigate = (Id) => {
    navigate(`/${link}/?search=${""}&id=${btoa(Id)}`)
  }
  return (
    <>
      <div className={styles.class_title_area_between}>
        <h2 className="title-left">
          {title}
          {desc && <span>{desc}</span>}
        </h2>
        {title !== "Top Trending Product(s)" && link && <span style={{ cursor: "pointer" }} onClick={() => handleNavigate(id)} className={styles.class_view_btn}>
          <Link title="view all product"><FaEye size={20} color="#8a934f" /></Link>
        </span>}
      </div>
    </>
  );
};

export default SectionTitle;
