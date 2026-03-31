import { useState } from "react";
import { Link } from "react-router-dom";
import PostList from "../components/PostList";
import SearchBar from "../components/SearchBar";

export default function HomePage() {
  const [search, setSearch] = useState("");

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
        <h1>Blog</h1>
        <Link to="/new">
          <button>New Post</button>
        </Link>
      </div>
      <SearchBar onSearch={setSearch} />
      <PostList search={search} />
    </div>
  );
}
