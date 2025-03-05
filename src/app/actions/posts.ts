// src/app/actions/posts.ts

"use server";

// Import Prisma client
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";

// Fetch all posts
export async function getPosts() {
  try {
    const posts = await prisma.post.findMany({
      include: {
        user: true,
      },
      orderBy: {
        createdAt: 'desc'
      },
    })
    return { success: true, posts }
  } catch (error) {
    console.error('Failed to fetch posts:', error)
    return { success: false, error: 'Failed to load posts' }
  }
}

// Fetch posts by a specific user ID
export const fetchPostsByUserId = async (userId: string) => {
  try {
    const posts = await prisma.post.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    return posts;
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

    const post = await prisma.post.create({
      data: {
        imageUrl,
        caption,
        userId: user.id,
      },
    });

    return { success: true, post };
  } catch (error) {
    console.error('Failed to create post:', error);
    return { success: false, error: 'Failed to create post' };
  }
}