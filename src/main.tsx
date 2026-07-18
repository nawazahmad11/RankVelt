import { blogPosts } from "./data/blogData";
import { validateBlogPosts } from "./utils/validateBlogPosts";



import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";


if (import.meta.env.DEV) {
    validateBlogPosts(blogPosts);
  }
  
createRoot(document.getElementById("root")!).render(<App />);
