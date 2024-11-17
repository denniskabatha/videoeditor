import React, { useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import HomePage from "./pages/HomePage";
import BookDetailsPage from "./pages/BookDetailsPage";
import AdminPage from "./pages/AdminPage";
import BorrowingHistoryPage from "./pages/BorrowingHistoryPage";
import { ThemeContext } from "./contexts/ThemeContext";

const App = () => {
  const { isDarkTheme, toggleTheme } = useContext(ThemeContext);

  return (
    <Router>
      <Navbar toggleTheme={toggleTheme} isDarkTheme={isDarkTheme} />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/book/:id" element={<BookDetailsPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/history" element={<BorrowingHistoryPage />} />
      </Routes>
    </Router>
  );
};

export default App;
