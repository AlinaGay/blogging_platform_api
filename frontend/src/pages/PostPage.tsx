import { useParams } from "react-router-dom";
import PostDetail from "../components/PostDetail";

export default function PostPage() {
  const { id } = useParams<{ id: string }>();
  const postId = Number(id);

  if (isNaN(postId)) return <p>Invalid post ID</p>;

  return <PostDetail postId={postId} />;
}
