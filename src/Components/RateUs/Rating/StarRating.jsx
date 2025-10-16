import React, { useState } from 'react';
import { FaStar } from 'react-icons/fa';
import './StarRating.css';

const StarRating = ({ rating, onChange }) => {
  const [hover, setHover] = useState(null);
  const [locked, setLocked] = useState(false); // lock hover after click

  const handleMouseEnter = (index) => {
    if (!locked) setHover(index);
  };

  const handleMouseLeave = () => {
    if (!locked) setHover(null);
  };

  const handleClick = (index) => {
    onChange(index);
    setLocked(true); // disable hover after click
  };

  return (
    <div className="star-rating">
      {[1, 2, 3, 4, 5].map((index) => {
        const isHovered = !locked && hover !== null && index <= hover;
        const isSelected = index <= rating;

        return (
          <span
            key={index}
            className={`star ${isSelected ? 'selected-yellow' : ''} ${isHovered ? 'bg-pink' : ''}`}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
            onClick={() => handleClick(index)}
          >
            <FaStar />
          </span>
        );
      })}
    </div>
  );
};

export default StarRating;
