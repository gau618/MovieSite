import React from 'react'
import "./Rating.scss";
  const Rating = ({ rating }) => {
    if (typeof rating === 'number') {
        rating = rating.toFixed(1);
    } else {
        rating = parseFloat(rating).toFixed(1);
    }
  return (
    <div className='Ratingbox'>
        <p className='Rating'>{rating}</p>
     </div>
  )
}

export default Rating;
