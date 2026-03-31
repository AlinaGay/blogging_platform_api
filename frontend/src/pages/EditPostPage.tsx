import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getPost, type Post } from "../api/posts";
import PostForm from "../components/PostForm";

export default function EditPostPage() {
  const { id } = useParams<{ id: string }>();

  if (!id) {
    return <PostForm />;
  }

  const postId = Number(id);
  const [post, setPost] = useState<Post | null>(null);
  const [error, setError] = useState("");

  useEffect(() => {
    getPost(postId)
      .then(setPost)
      .catch(() => setError("Post not found"));
  }, [postId]);

  if (error) return <p style={{ color: "red" }}>{error}</p>;
  if (!post) return <p>Loading...</p>;

  return <PostForm existing={post} />;
}
