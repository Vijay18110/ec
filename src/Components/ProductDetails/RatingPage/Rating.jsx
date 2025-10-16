import React from 'react';

const StarRating = ({ rating, max = 5 }) => {
  const fullStar = '★';
  const halfStar = '⯨'; // Customize with SVG if needed
  const emptyStar = '☆';

  const roundedRating = Math.round(rating * 2) / 2; // Round to nearest 0.5
  const stars = [];

  for (let i = 1; i <= max; i++) {
    if (i <= Math.floor(roundedRating)) {
      stars.push(<span key={i}>{fullStar}</span>);
    } else if (i - roundedRating === 0.5) {
      stars.push(<span key={i}>{halfStar}</span>);
    } else {
      stars.push(<span key={i}>{emptyStar}</span>);
    }
  }

  return <span style={{ fontSize: '24px', color: 'gold' }}>{stars}</span>;
};

export default StarRating;
