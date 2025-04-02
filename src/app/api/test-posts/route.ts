import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/authOptions'; // Adjust path as needed

export async function GET() {
  try {
    // Get session for authentication (optional, remove if not needed)
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const posts = await prisma.post.findMany({
      include: {
        user: { select: { name: true } }, // Only select name for efficiency
        images: true,                     // Include post images
        likes: true,                      // Include likes for count
        comments: {                       // Include comments relation
          include: {
            user: { select: { name: true } }, // Include comment author's name
          },
          orderBy: { createdAt: 'asc' },    // Sort comments by creation date
        },
      },
      orderBy: { createdAt: 'desc' },     // Consistent ordering
    });

    // Format posts to match our expected structure
    const formattedPosts = posts.map(post => ({
      id: post.id,
      caption: post.caption,
      createdAt: post.createdAt.toISOString(),
      user: post.user,
      likes: post.likes.length,
      images: post.images,
      userLiked: userId ? post.likes.some(like => like.userId === userId) : false, // Track if current user liked
      comments: post.comments.map(comment => ({     // Add formatted comments
        id: comment.id,
        content: comment.content,
        user: comment.user,
        createdAt: comment.createdAt.toISOString(),
      })),
    }));

    return NextResponse.json({ 
      success: true, 
      count: formattedPosts.length,
      posts: formattedPosts 
    });
  } catch (error) {
    console.error('Database error:', error);
    return NextResponse.json({ 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error' 
    }, { status: 500 });
  }
}