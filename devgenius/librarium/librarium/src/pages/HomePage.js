import React, { useEffect, useState } from "react";
import BookGrid from "../components/BookGrid";
import SearchBar from "../components/SearchBar";
import FilterMenu from "../components/FilterMenu";
import { fetchBooks } from "../utils/api";

const HomePage = () => {
  const [books, setBooks] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedGenre, setSelectedGenre] = useState("");

  useEffect(() => {
    fetchBooks().then(setBooks);
  }, []);

  const filteredBooks = books.filter((book) => {
    return (
      (!selectedGenre || book.genre === selectedGenre) &&
      (!searchTerm ||
        book.title.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  });

  return (
    <div className="home-page">
      <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} />
      <FilterMenu
        genres={[...new Set(books.map((book) => book.genre))]}
        selectedGenre={selectedGenre}
        setSelectedGenre={setSelectedGenre}
      />
      <BookGrid books={filteredBooks} />
    </div>
  );
};

export default HomePage;
