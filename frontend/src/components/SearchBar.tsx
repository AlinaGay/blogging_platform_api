import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
}

export default function SearchBar({ onSearch }: SearchBarProps) {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query.trim());
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search posts..."
        style={{ flex: 1, padding: "8px" }}
      />
      <button type="submit">Search</button>
      {query && (
        <button
          type="button"
          onClick={() => {
            setQuery("");
            onSearch("");
          }}
        >
          Clear
        </button>
      )}
    </form>
  );
}
