import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { createPost, updatePost, type Post } from "../api/posts";

interface PostFormProps {
  existing?: Post;
}

export default function PostForm({ existing }: PostFormProps) {
  const navigate = useNavigate();
  const [title, setTitle] = useState(existing?.title ?? "");
  const [body, setBody] = useState(existing?.body ?? "");
  const [summary, setSummary] = useState(existing?.summary ?? "");
  const [tagsInput, setTagsInput] = useState(existing?.tags?.join(", ") ?? "");
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const tags = tagsInput
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    try {
      if (existing) {
        await updatePost(existing.id, {
          title,
          body,
          summary: summary || undefined,
          tags,
        });
        navigate(`/posts/${existing.id}`);
      } else {
        const post = await createPost({
          title,
          body,
          summary: summary || undefined,
          tags,
        });
        navigate(`/posts/${post.id}`);
      }
    } catch {
      setError("Failed to save post. Please check your input.");
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ maxWidth: "600px" }}>
      <h2>{existing ? "Edit Post" : "New Post"}</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <div style={{ marginBottom: "12px" }}>
        <label>
          Title *
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            maxLength={200}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label>
          Summary
          <input
            type="text"
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            maxLength={500}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label>
          Tags (comma-separated)
          <input
            type="text"
            value={tagsInput}
            onChange={(e) => setTagsInput(e.target.value)}
            placeholder="e.g. python, tutorial, api"
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>
      </div>
      <div style={{ marginBottom: "12px" }}>
        <label>
          Body *
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            required
            maxLength={50000}
            rows={15}
            style={{ display: "block", width: "100%", padding: "8px", marginTop: "4px" }}
          />
        </label>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="submit" disabled={saving}>
          {saving ? "Saving..." : existing ? "Update" : "Create"}
        </button>
        <button type="button" onClick={() => navigate(-1)}>
          Cancel
        </button>
      </div>
    </form>
  );
}
