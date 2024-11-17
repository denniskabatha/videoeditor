// src/utils/api.js

const API_BASE_URL = "http://localhost:3000"; // Updated to the local server URL

export const fetchBooks = async () => {
  const response = await fetch(`${API_BASE_URL}/books`);
  if (!response.ok) {
    throw new Error("Failed to fetch books.");
  }
  return response.json();
};

export const fetchBookDetails = async (id) => {
  const response = await fetch(`${API_BASE_URL}/books/${id}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch book with ID ${id}.`);
  }
  return response.json();
};

export const fetchBorrowings = async () => {
  const response = await fetch(`${API_BASE_URL}/borrowings`);
  if (!response.ok) {
    throw new Error("Failed to fetch borrowings.");
  }
  return response.json();
};

export const fetchBookById = async (bookId) => {
  const response = await fetch(`${API_BASE_URL}/books/${bookId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch book with ID ${bookId}.`);
  }
  return response.json();
};

export const fetchUserById = async (userId) => {
  const response = await fetch(`${API_BASE_URL}/users/${userId}`);
  if (!response.ok) {
    throw new Error(`Failed to fetch user with ID ${userId}.`);
  }
  return response.json();
};
