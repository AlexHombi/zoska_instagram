// src/app/prispevok/page.tsx

import Typography from "@mui/material/Typography";
import { Grid2, Card, CardContent, CardMedia, Box } from "@mui/material";
import Link from "next/link";
import { getPosts } from "@/app/actions/posts";

export const metadata = { title: `Zoznam prispevkov | ZoskaSnap` };

export default async function PostList() {
  const { success, posts, error } = await getPosts();

  if (!success) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Error loading posts</Typography>
        <Typography variant="body2" color="textSecondary">{error}</Typography>
      </Box>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6">No posts found.</Typography>
        <Typography variant="body2" color="textSecondary">Be the first to create a post!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid2
        container
        direction="column"
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        {posts.map((post) => (
          <Grid2
            sx={{
              width: '100%',
              maxWidth: '500px',
            }}
            key={post.id}
          >
            <Link href={`/prispevok/${post.id}`} passHref style={{ textDecoration: 'none' }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  maxHeight: '600px',
                  width: '100%',
                  margin: 'auto',
                  cursor: 'pointer',
                  transition: 'transform 0.3s',
                  '&:hover': {
                    transform: 'scale(1.02)',
                  },
                }}
              >
                <CardMedia
                  component="img"
                  alt={post.caption || "Post Image"}
                  height="200"
                  image={post.imageUrl}
                  sx={{ objectFit: 'cover' }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6" gutterBottom>
                    {post.user?.name || "Unknown user"}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {post.caption || "No caption available"}
                  </Typography>
                  <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                    {new Date(post.createdAt).toLocaleString('sk-SK')}
                  </Typography>
                </CardContent>
              </Card>
            </Link>
          </Grid2>
        ))}
      </Grid2>
    </Box>
  );
}