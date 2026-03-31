import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { deletePost, getPost, type Post } from "../api/posts";

interface PostDetailProps {
  postId: number;
}

export default function PostDetail({ postId }: PostDetailProps) {
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getPost(postId)
      .then(setPost)
      .catch(() => setError("Post not found"));
  }, [postId]);

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this post?")) return;
    try {
      await deletePost(postId);
      navigate("/");
    } catch {
      setError("Failed to delete post");
    }
  };

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return (
    <article>
      <h1>{post.title}</h1>
      <div style={{ color: "#666", marginBottom: "16px" }}>
        <small>
          Created: {new Date(post.created_at).toLocaleString()}
          {post.updated_at !== post.created_at &&
            ` · Updated: ${new Date(post.updated_at).toLocaleString()}`}
        </small>
        {post.tags && post.tags.length > 0 && (
          <div style={{ marginTop: "4px" }}>
            {post.tags.map((tag) => (
              <span
                key={tag}
                style={{
                  background: "#eee",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  marginRight: "4px",
                  fontSize: "0.85em",
                }}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
      {post.summary && (
        <p style={{ fontStyle: "italic", color: "#555", borderLeft: "3px solid #ddd", paddingLeft: "12px" }}>
          {post.summary}
        </p>
      )}
      <div style={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}>{post.body}</div>
      <div style={{ marginTop: "24px", display: "flex", gap: "8px" }}>
        <button onClick={() => navigate(`/posts/${postId}/edit`)}>Edit</button>
        <button onClick={handleDelete} style={{ color: "red" }}>
          Delete
        </button>
        <button onClick={() => navigate("/")}>Back to list</button>
      </div>
    </article>
  );
}
