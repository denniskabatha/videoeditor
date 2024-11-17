import React from "react";
import { Link } from "react-router-dom";

const BookCard = ({ book }) => {
  return (
    <div className="book-card">
      <img src={book.coverImage} alt={book.title} />
      <div className="book-info">
        <h3>{book.title}</h3>
        <p>Author: {book.author}</p>
        <p>Genre: {book.genre}</p>
        <Link to={`/book/${book.id}`} className="details-link">
          View Details
        </Link>
      </div>
    </div>
  );
};

export default BookCard;
