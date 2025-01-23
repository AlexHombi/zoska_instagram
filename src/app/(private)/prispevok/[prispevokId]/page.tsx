// src/app/prispevok/[prispevokId]/page.tsx

import { PrismaClient } from "@prisma/client";
import Typography from "@mui/material/Typography";
import { Card, CardContent, CardMedia, Box } from "@mui/material";

const prisma = new PrismaClient();

export const metadata = { title: `Detail prispevku | ZoskaSnap` };

// Server-side component to fetch post details based on ID
const PostDetail = async ({ params }: { params: { prispevokId: string }}) => {
  try {
    // Fetch the specific post using the `prispevokId`
    const post = await prisma.post.findUnique({
      where: { id: params.prispevokId },
      include: {
        user: true, // Optional: Include user information if needed
      },
    });

    if (!post) {
      return <Typography>Post not found.</Typography>;
    }

    return (
      <Box sx={{ padding: 3 }}>

        <Card sx={{ maxWidth: 600, margin: 'auto' }}>

          <CardMedia
            component="img"
            alt={post.caption || "Post Image"}
            height="400"
            image={post.imageUrl}
          />
          <CardContent>
            <Typography variant="h6" gutterBottom>
              {post.user?.name || "Unknown user"}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {post.caption || "No caption available"}
            </Typography>
            <Typography variant="caption" color="textSecondary">
              {new Date(post.createdAt).toLocaleString()}
            </Typography>
          </CardContent>
        </Card>
      </Box>
    );
  } catch (error) {
    console.error("Error fetching post details:", error);
    return <Typography>Error loading post details</Typography>;
  } finally {
    await prisma.$disconnect();
  }
};

export default PostDetail;