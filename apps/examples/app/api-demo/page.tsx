"use client";

import { useState } from "react";
import { getPosts, getPost, createPost, type Post } from "../api/client";
import styles from "./page.module.css";

export default function ApiDemo(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [singlePost, setSinglePost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetPosts = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPosts();
      setPosts(result.response.slice(0, 5)); // Show only first 5 posts
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPost = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getPost(1);
      setSinglePost(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await createPost({
        title: "New Post from Aglaya API Core",
        body: "This post was created using @aglaya/api-core package!",
        userId: 1,
      });
      setSinglePost(result.response);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>@aglaya/api-core Demo</h1>
        <p>
          This example demonstrates how to use the @aglaya/api-core package to
          make HTTP requests.
        </p>
      </div>

      <div className={styles.controls}>
        <button onClick={handleGetPosts} disabled={loading}>
          Get Posts (List)
        </button>
        <button onClick={handleGetPost} disabled={loading}>
          Get Single Post
        </button>
        <button onClick={handleCreatePost} disabled={loading}>
          Create Post
        </button>
      </div>

      {loading && <div className={styles.loading}>Loading...</div>}
      {error && <div className={styles.error}>Error: {error}</div>}

      {singlePost && (
        <div className={styles.result}>
          <h2>Single Post Result</h2>
          <div className={styles.post}>
            <h3>{singlePost.title}</h3>
            <p>{singlePost.body}</p>
            <small>
              Post ID: {singlePost.id} | User ID: {singlePost.userId}
            </small>
          </div>
        </div>
      )}

      {posts.length > 0 && (
        <div className={styles.result}>
          <h2>Posts List (First 5)</h2>
          <div className={styles.postList}>
            {posts.map((post) => (
              <div key={post.id} className={styles.post}>
                <h3>{post.title}</h3>
                <p>{post.body}</p>
                <small>
                  Post ID: {post.id} | User ID: {post.userId}
                </small>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
