import React, { useState } from "react";
import { fetchSearchResults } from "../api"; // replace with your API function

function Search() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    const results = await fetchSearchResults(searchTerm); // replace with your API function
    setSearchResults(results);
  };

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
      <div>
        {searchResults.map((result) => (
          <div key={result.id}>
            <p>{result.name}</p> {/* replace with your data */}
            <p>{result.date}</p> {/* replace with your data */}
            {/* add more data fields here */}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Search;
