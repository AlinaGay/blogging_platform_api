import { BrowserRouter, Route, Routes } from "react-router-dom";
import EditPostPage from "./pages/EditPostPage";
import HomePage from "./pages/HomePage";
import PostPage from "./pages/PostPage";

export default function App() {
  return (
    <BrowserRouter>
      <div style={{ maxWidth: "800px", margin: "0 auto", padding: "16px" }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/posts/:id" element={<PostPage />} />
          <Route path="/posts/:id/edit" element={<EditPostPage />} />
          <Route path="/new" element={<EditPostPage />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}
