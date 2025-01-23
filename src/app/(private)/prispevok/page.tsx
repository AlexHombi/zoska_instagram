// src/app/prispevok/page.tsx

import { PrismaClient } from "@prisma/client";
import Typography from "@mui/material/Typography";
import { Grid2, Card, CardContent, CardMedia, Box } from "@mui/material";
import Link from "next/link";

// Initialize Prisma client
const prisma = new PrismaClient();

export const metadata = { title: `Zoznam prispevkov | ZoskaSnap` };

// Server-side component that fetches the posts
const PostList = async () => {
  try {
    // Fetch posts from the database
    const posts = await prisma.post.findMany({
      include: {
        user: true, // Optional: include related user info (like name, email, etc.)
      },
    });

    if (posts.length === 0) {
      return <Typography>No posts found.</Typography>;
    }

    return (
      <Box sx={{ padding: 3 }}>

        {/* Grid Layout for a single column */}
        <Grid2
          container
          direction="column" // Force the posts to stack vertically
          spacing={3}
          justifyContent="center" // Center the content horizontally
          alignItems="center" // Align the items in the center
        >
          {posts.map((post) => (
            <Grid2
              sx={{
                width: '100%', // Full width for each item in the grid
                maxWidth: '500px', // Maximum width for each card (adjust as necessary)
              }}
              key={post.id}
            >
              {/* Remove underline from Link */}
              <Link href={`/prispevok/${post.id}`} passHref style={{ textDecoration: 'none' }}>
                <Card
                  sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    height: 'auto',
                    maxHeight: '600px',
                    width: '100%',
                    margin: 'auto',
                    cursor: 'pointer', // Change the cursor to indicate it's clickable
                    transition: 'transform 0.3s', // Smooth transition for hover effect
                    '&:hover': {
                      transform: 'scale(1.05)', // Hover effect to slightly enlarge the card
                    },
                  }}
                >
                  <CardMedia
                    component="img"
                    alt={post.caption || "Post Image"}
                    height="200"
                    image={post.imageUrl}
                  />
                  <CardContent sx={{ flex: 1 }}>
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
              </Link>
            </Grid2>
          ))}
        </Grid2>
      </Box>
    );
  } catch (error) {
    console.error("Error fetching posts:", error);
    return <Typography>Error loading posts</Typography>;
  } finally {
    await prisma.$disconnect();
  }
};

export default PostList;