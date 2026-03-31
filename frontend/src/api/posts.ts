import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8000/api/v1",
  headers: { "Content-Type": "application/json" },
});

export interface Post {
  id: number;
  title: string;
  body: string;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PostListItem {
  id: number;
  title: string;
  summary: string | null;
  tags: string[] | null;
  created_at: string;
  updated_at: string;
}

export interface PostListResponse {
  items: PostListItem[];
  total: number;
  skip: number;
  limit: number;
}

export interface PostCreate {
  title: string;
  body: string;
  summary?: string;
  tags?: string[];
}

export interface PostUpdate {
  title?: string;
  body?: string;
  summary?: string;
  tags?: string[];
}

export async function listPosts(
  skip = 0,
  limit = 20,
  search?: string
): Promise<PostListResponse> {
  const params: Record<string, string | number> = { skip, limit };
  if (search) params.search = search;
  const { data } = await api.get<PostListResponse>("/posts", { params });
  return data;
}

export async function getPost(id: number): Promise<Post> {
  const { data } = await api.get<Post>(`/posts/${id}`);
  return data;
}

export async function createPost(post: PostCreate): Promise<Post> {
  const { data } = await api.post<Post>("/posts", post);
  return data;
}

export async function updatePost(
  id: number,
  post: PostUpdate
): Promise<Post> {
  const { data } = await api.put<Post>(`/posts/${id}`, post);
  return data;
}

export async function deletePost(id: number): Promise<void> {
  await api.delete(`/posts/${id}`);
}
