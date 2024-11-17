// src/pages/BorrowingHistoryPage.js

import React, { useEffect, useState } from "react";
import { fetchBorrowings, fetchBookById, fetchUserById } from "../utils/api";

const BorrowingHistory = () => {
  const [borrowings, setBorrowings] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const rawBorrowings = await fetchBorrowings();

        // Resolve book and user data for each borrowing
        const resolvedBorrowings = await Promise.all(
          rawBorrowings.map(async (borrowing) => {
            const book = await fetchBookById(borrowing.bookId);
            const user = await fetchUserById(borrowing.userId);

            return {
              ...borrowing,
              book,
              user,
            };
          })
        );

        setBorrowings(resolvedBorrowings);
        setLoading(false);
      } catch (err) {
        setError("Failed to fetch borrowing history.");
        console.error(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div className="borrowing-history">
      <h1>Borrowing History</h1>
      {borrowings.length === 0 ? (
        <p>No borrowings found.</p>
      ) : (
        <ul>
          {borrowings.map((borrowing) => {
            if (!borrowing.book || !borrowing.user) return null;

            return (
              <li key={borrowing.id}>
                <p>
                  <strong>Title:</strong> {borrowing.book.title}
                </p>
                <p>
                  <strong>Borrower:</strong> {borrowing.user.name}
                </p>
                <p>
                  <strong>Borrow Date:</strong> {new Date(borrowing.borrowDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Due Date:</strong> {new Date(borrowing.dueDate).toLocaleDateString()}
                </p>
                <p>
                  <strong>Status:</strong>{" "}
                  {borrowing.returned ? (
                    "Returned"
                  ) : new Date(borrowing.dueDate) < new Date() ? (
                    <span style={{ color: "red" }}>Overdue</span>
                  ) : (
                    "On Time"
                  )}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default BorrowingHistory;
