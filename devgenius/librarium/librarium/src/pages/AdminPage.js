import React, { useEffect, useState } from "react";

const AdminPage = () => {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({});

  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = () => {
    fetch("http://localhost:3000/books")
      .then((res) => res.json())
      .then((data) => setBooks(data));
  };

  const handleCreateBook = () => {
    fetch("http://localhost:3000/books", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      fetchBooks();
      setFormData({});
    });
  };

  const handleUpdateBook = (id) => {
    fetch(`http://localhost:3000/books/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    }).then(() => {
      fetchBooks();
      setFormData({});
    });
  };

  const handleDeleteBook = (id) => {
    fetch(`http://localhost:3000/books/${id}`, { method: "DELETE" }).then(() =>
      fetchBooks()
    );
  };

  return (
    <div className="admin-page">
      <h1 className="admin-title">Admin Page</h1>
      <div className="form">
        <input
          type="text"
          placeholder="Title"
          onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        />
        <input
          type="text"
          placeholder="Author"
          onChange={(e) => setFormData({ ...formData, author: e.target.value })}
        />
        <input
          type="text"
          placeholder="Genre"
          onChange={(e) => setFormData({ ...formData, genre: e.target.value })}
        />
        <input
          type="url"
          placeholder="Cover Image URL"
          onChange={(e) =>
            setFormData({ ...formData, coverImage: e.target.value })
          }
        />
        <button onClick={handleCreateBook}>Create</button>
      </div>
      <div className="book-list">
        {books.map((book) => (
          <div key={book.id} className="admin-book-card">
            <h3>{book.title}</h3>
            <button onClick={() => handleUpdateBook(book.id)}>Edit</button>
            <button onClick={() => handleDeleteBook(book.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminPage;
