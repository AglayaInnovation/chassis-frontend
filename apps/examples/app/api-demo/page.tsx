"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Loader2, CheckCircle2, XCircle, List, FileText, PlusCircle } from "lucide-react";

import { getPosts, getPost, createPost, type Post } from "../api/client";
import { ThemeToggle } from "@/components/theme-toggle";

export default function ApiDemo(): JSX.Element {
  const [posts, setPosts] = useState<Post[]>([]);
  const [singlePost, setSinglePost] = useState<Post | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [lastAction, setLastAction] = useState<string>("");

  const handleGetPosts = async () => {
    setLoading(true);
    setError(null);
    setLastAction("Fetching posts list...");
    setSinglePost(null);
    try {
      const result = await getPosts();
      setPosts(result.response.slice(0, 5)); // Show only first 5 posts
      setLastAction("Successfully fetched posts");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch posts");
      setLastAction("Failed to fetch posts");
    } finally {
      setLoading(false);
    }
  };

  const handleGetPost = async () => {
    setLoading(true);
    setError(null);
    setLastAction("Fetching single post...");
    setPosts([]);
    try {
      const result = await getPost(1);
      setSinglePost(result.response);
      setLastAction("Successfully fetched post #1");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch post");
      setLastAction("Failed to fetch post");
    } finally {
      setLoading(false);
    }
  };

  const handleCreatePost = async () => {
    setLoading(true);
    setError(null);
    setLastAction("Creating new post...");
    setPosts([]);
    try {
      const result = await createPost({
        title: "New Post from Aglaya API Core",
        body: "This post was created using @aglaya/api-core package!",
        userId: 1,
      });
      setSinglePost(result.response);
      setLastAction("Successfully created new post");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to create post");
      setLastAction("Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-sm font-medium hover:text-primary transition-colors"
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Home
            </Link>
          </div>
          <ThemeToggle />
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Page Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">@aglaya/api-core Demo</h1>
          <p className="text-muted-foreground">
            Interactive examples demonstrating HTTP requests with @aglaya/api-core
          </p>
        </div>

        {/* Action Buttons */}
        <section className="rounded-lg border bg-card p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">API Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <button
              onClick={handleGetPosts}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <List className="h-4 w-4" />
              Get Posts (List)
            </button>
            <button
              onClick={handleGetPost}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-secondary text-secondary-foreground hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <FileText className="h-4 w-4" />
              Get Single Post
            </button>
            <button
              onClick={handleCreatePost}
              disabled={loading}
              className="flex items-center justify-center gap-2 px-4 py-3 rounded-md bg-accent text-accent-foreground hover:bg-accent/80 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium transition-colors"
            >
              <PlusCircle className="h-4 w-4" />
              Create Post
            </button>
          </div>
        </section>

        {/* Status Messages */}
        {loading && (
          <div className="mb-6 rounded-lg border bg-blue-50 dark:bg-blue-950/20 border-blue-200 dark:border-blue-900 p-4">
            <div className="flex items-center gap-3">
              <Loader2 className="h-5 w-5 text-blue-600 dark:text-blue-400 animate-spin" />
              <div>
                <p className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  {lastAction}
                </p>
              </div>
            </div>
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-lg border bg-red-50 dark:bg-red-950/20 border-red-200 dark:border-red-900 p-4">
            <div className="flex items-center gap-3">
              <XCircle className="h-5 w-5 text-red-600 dark:text-red-400" />
              <div>
                <p className="text-sm font-medium text-red-900 dark:text-red-100">
                  Error
                </p>
                <p className="text-sm text-red-700 dark:text-red-300">{error}</p>
              </div>
            </div>
          </div>
        )}

        {!loading && !error && lastAction && (
          <div className="mb-6 rounded-lg border bg-green-50 dark:bg-green-950/20 border-green-200 dark:border-green-900 p-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              <div>
                <p className="text-sm font-medium text-green-900 dark:text-green-100">
                  {lastAction}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Single Post Result */}
        {singlePost && (
          <section className="rounded-lg border bg-card p-6 mb-6">
            <h2 className="text-xl font-semibold mb-4">Single Post Result</h2>
            <div className="rounded-lg border bg-muted/50 p-4">
              <h3 className="text-lg font-semibold mb-2">{singlePost.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {singlePost.body}
              </p>
              <div className="flex gap-4 text-xs text-muted-foreground">
                <span className="px-2 py-1 bg-background rounded">
                  Post ID: {singlePost.id}
                </span>
                <span className="px-2 py-1 bg-background rounded">
                  User ID: {singlePost.userId}
                </span>
              </div>
            </div>
          </section>
        )}

        {/* Posts List Result */}
        {posts.length > 0 && (
          <section className="rounded-lg border bg-card p-6">
            <h2 className="text-xl font-semibold mb-4">Posts List (First 5)</h2>
            <div className="space-y-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="rounded-lg border bg-muted/50 p-4 hover:bg-muted/70 transition-colors"
                >
                  <h3 className="text-base font-semibold mb-2">{post.title}</h3>
                  <p className="text-sm text-muted-foreground mb-3">
                    {post.body}
                  </p>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span className="px-2 py-1 bg-background rounded">
                      Post ID: {post.id}
                    </span>
                    <span className="px-2 py-1 bg-background rounded">
                      User ID: {post.userId}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Empty State */}
        {!loading && !error && !singlePost && posts.length === 0 && !lastAction && (
          <div className="rounded-lg border border-dashed bg-muted/20 p-12 text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-4">
              <FileText className="h-6 w-6 text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Data Yet</h3>
            <p className="text-sm text-muted-foreground mb-4">
              Click one of the buttons above to start making API requests
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
