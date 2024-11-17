import React from "react";

const FilterMenu = ({ genres, selectedGenre, setSelectedGenre }) => {
  return (
    <div className="filter-menu">
      <select
        value={selectedGenre}
        onChange={(e) => setSelectedGenre(e.target.value)}
      >
        <option value="">All Genres</option>
        {genres.map((genre) => (
          <option key={genre} value={genre}>
            {genre}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterMenu;
