import React, { useState } from "react";

const SortBy = ({ onSortChange, dataCount }) => {
  const [selected, setSelected] = useState("");
  const sortOptions = [
    { label: "Popularity", value: "popularity" },
    { label: "Price -- Low to High", value: "priceLowToHigh" },
    { label: "Price -- High to Low", value: "priceHighToLow" },
    { label: "Discount", value: "discount" },
  ];
  const handleSortChange = (value) => {
    setSelected(value);
    onSortChange(value); // Trigger sort logic from parent
  };
  // console.log(dataCount)
  return (
    <div className="d-flex align-items-center flex-wrap gap-3 my-2">
      <strong>Sort By</strong>
      {sortOptions.map((option) => (
        <span
          key={option.value}
          onClick={() => handleSortChange(option.value)}
          className=" position-relative"
          style={{
            cursor: "pointer",
            fontFamily: "sans-serif",
            color: selected === option.value ? "#fff" : "#000",
            background: selected === option.value ? "rgb(138, 147, 79)" : "",
            borderRadius: selected === option.value ? "4px" : "",
            padding: selected === option.value ? "3px 7px" : "",
            fontWeight: selected === option.value ? "normal" : "normal",
            // textDecoration: selected === option.value ? "underline" : "none",
          }}
        >
          {option.label}
          {selected === option.value && <span class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-secondary">
            {dataCount ? dataCount : <div className="text-center">
              <span style={{ width: "10px", height: "10px" }} className="spinner-border text-success"></span>
            </div>}
            <span class="visually-hidden">unread messages</span>
          </span>}
        </span>
      ))}
    </div>
  );
};

export default SortBy;
