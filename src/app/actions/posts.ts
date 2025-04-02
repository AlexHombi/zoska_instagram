// src/app/actions/posts.ts

"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

// Fetch all posts
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: { select: { name: true } }, // Select only name
        images: true,                     // Include images relation
        likes: true,                      // Include likes relation
        comments: {                       // Include comments relation
          include: {
            user: { select: { name: true } }, // Include comment author's name
          },
          orderBy: { createdAt: 'asc' },    // Sort comments by creation date
        },
      },
      orderBy: {
        createdAt: 'desc'                 // Sort posts by creation date
      },
    });

    // Format posts to match the expected structure
    const formattedPosts = posts.map(post => ({
      id: post.id,
      caption: post.caption,
      createdAt: post.createdAt.toISOString(),
      user: post.user,
      likes: post.likes.length,
      images: post.images,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt.toISOString(),
      })),
    }));

    return { success: true, posts: formattedPosts };
  } catch (error) {
    console.error('Failed to fetch posts:', error);
    return { success: false, error: 'Failed to load posts' };
  }
}

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      include: {
        user: { select: { name: true } }, // Include user info
        images: true,                     // Include images relation
        likes: true,                      // Include likes relation
        comments: {                       // Include comments relation
          include: {
            user: { select: { name: true } },
          },
          orderBy: { createdAt: 'asc' },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    // Format posts consistently with getPosts
    const formattedPosts = posts.map(post => ({
      id: post.id,
      caption: post.caption,
      createdAt: post.createdAt.toISOString(),
      user: post.user,
      likes: post.likes.length,
      images: post.images,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt.toISOString(),
      })),
    }));

    return formattedPosts;
  } catch (error) {
    console.error("Error fetching posts by userId:", error);
    throw new Error("Could not fetch posts");
  }
};

// Create a new post
export async function createPost(formData: FormData) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return { success: false, error: 'You must be logged in to create a post' };
    }

    const imageUrl = formData.get('imageUrl') as string;
    const caption = formData.get('caption') as string;

    if (!imageUrl) {
      return { success: false, error: 'Image URL is required' };
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return { success: false, error: 'User not found' };
    }

    // Create post with image in PostImage model
    const post = await prisma.post.create({
      data: {
        caption,
        userId: user.id,
        images: {
          create: {
            imageUrl,
            order: 0, // Default order for single image
          },
        },
      },
      include: {
        user: { select: { name: true } },
        images: true,
        likes: true,
        comments: {                       // Include comments (empty initially)
          include: {
            user: { select: { name: true } },
          },
        },
      },
    });

    // Format the response to match other functions
    const formattedPost = {
      id: post.id,
      caption: post.caption,
      createdAt: post.createdAt.toISOString(),
      user: post.user,
      likes: post.likes.length,
      images: post.images,
      comments: post.comments.map(comment => ({
        id: comment.id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt.toISOString(),
      })),
    };

    return { success: true, post: formattedPost };
  } catch (error) {
    console.error('Failed to create post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}