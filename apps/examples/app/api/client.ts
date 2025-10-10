import { ApiClient } from "@aglaya/api-core";

// Example API client for JSONPlaceholder
const client = new ApiClient({
  baseURL: "https://jsonplaceholder.typicode.com",
  contentType: "application/json",
});

// Example: Get all posts
export const getPosts = () => client.get<Post[]>("/posts");

// Example: Get a single post
export const getPost = (id: number) => client.get<Post>(`/posts/${id}`);

// Example: Create a new post
export const createPost = (data: CreatePostInput) =>
  client.post<Post>("/posts", { body: data });

// Example: Update a post
export const updatePost = (id: number, data: UpdatePostInput) =>
  client.put<Post>(`/posts/${id}`, { body: data });

// Example: Delete a post
export const deletePost = (id: number) => client.delete(`/posts/${id}`);

// Types
export interface Post {
  userId: number;
  id: number;
  title: string;
  body: string;
}

export interface CreatePostInput {
  [key: string]: string | number;
  title: string;
  body: string;
  userId: number;
}

export interface UpdatePostInput {
  [key: string]: string | number | undefined;
  title?: string;
  body?: string;
  userId?: number;
}
