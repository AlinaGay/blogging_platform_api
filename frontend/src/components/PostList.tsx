import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { listPosts, type PostListItem, type PostListResponse } from "../api/posts";

interface PostListProps {
  search?: string;
}

export default function PostList({ search }: PostListProps) {
  const [data, setData] = useState<PostListResponse | null>(null);
  const [page, setPage] = useState(0);
  const [error, setError] = useState("");
  const limit = 20;

  useEffect(() => {
    setPage(0);
  }, [search]);

  useEffect(() => {
    setError("");
    listPosts(page * limit, limit, search || undefined)
      .then(setData)
      .catch(() => setError("Failed to load posts"));
  }, [page, search]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!data) return <p>Loading...</p>;

  const totalPages = Math.ceil(data.total / limit);

  return (
    <div>
      {data.items.length === 0 ? (
        <p>No posts found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {data.items.map((post: PostListItem) => (
            <li key={post.id} style={{ marginBottom: "16px", borderBottom: "1px solid #eee", paddingBottom: "12px" }}>
              <Link to={`/posts/${post.id}`} style={{ textDecoration: "none" }}>
                <h3 style={{ margin: "0 0 4px" }}>{post.title}</h3>
              </Link>
              {post.summary && <p style={{ margin: "0 0 4px", color: "#666" }}>{post.summary}</p>}
              <small style={{ color: "#999" }}>
                {new Date(post.created_at).toLocaleDateString()}
                {post.tags && post.tags.length > 0 && ` · ${post.tags.join(", ")}`}
              </small>
            </li>
          ))}
        </ul>
      )}
      {totalPages > 1 && (
        <div style={{ display: "flex", gap: "8px", justifyContent: "center" }}>
          <button disabled={page === 0} onClick={() => setPage(page - 1)}>
            Previous
          </button>
          <span>
            Page {page + 1} of {totalPages}
          </span>
          <button disabled={page >= totalPages - 1} onClick={() => setPage(page + 1)}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}
