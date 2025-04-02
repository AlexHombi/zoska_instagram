"use client";

import Typography from "@mui/material/Typography";
import { Grid, Card, CardContent, CardMedia, Box } from "@mui/material";
import Link from "next/link";
import { getPosts } from "@/app/actions/posts";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect } from "react";

// Define the Post type based on your schema
type Post = {
  id: string;
  caption?: string;
  createdAt: string;
  user?: { name: string };
  likes: number;
  images: { imageUrl: string }[]; // Updated to use PostImage model
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});

  useEffect(() => {
    async function fetchPosts() {
      const { success, posts: fetchedPosts, error } = await getPosts();

      if (success && fetchedPosts) {
        setPosts(fetchedPosts);
        
        // Load liked posts from local storage
        const storedLikes = localStorage.getItem("userLikes");
        if (storedLikes) {
          setUserLikes(JSON.parse(storedLikes));
        }
      } else {
        setError(error || "Error loading posts");
      }

      setLoading(false);
    }

    fetchPosts();
  }, []);

  // Handle like/unlike action
  const handleLike = async (postId: string, currentLikes: number) => {
    const isLiked = userLikes[postId] || false;
    const updatedLikes = isLiked ? currentLikes - 1 : currentLikes + 1;

    // Optimistic UI update
    setPosts(posts.map(post => 
      post.id === postId 
        ? { ...post, likes: updatedLikes } 
        : post
    ));

    // Update local storage
    const newLikesState = { ...userLikes, [postId]: !isLiked };
    setUserLikes(newLikesState);
    localStorage.setItem("userLikes", JSON.stringify(newLikesState));

    // API call to update the backend
    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: isLiked ? 'DELETE' : 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      if (!response.ok) {
        throw new Error('Failed to update like');
      }
    } catch (err) {
      console.error('Error updating like:', err);
      
      // Revert on failure
      setPosts(posts.map(post => 
        post.id === postId 
          ? { ...post, likes: currentLikes }
          : post
      ));

      setUserLikes(prevLikes => ({ ...prevLikes, [postId]: isLiked }));
      localStorage.setItem("userLikes", JSON.stringify({ ...userLikes, [postId]: isLiked }));
    }
  };

  if (loading) {
    return <Box sx={{ padding: 3, textAlign: 'center' }}><Typography>Loading...</Typography></Box>;
  }

  if (error) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography color="error" variant="h6">Error loading posts</Typography>
        <Typography variant="body2" color="textSecondary">{error}</Typography>
      </Box>
    );
  }

  if (!posts.length) {
    return (
      <Box sx={{ padding: 3, textAlign: 'center' }}>
        <Typography variant="h6">No posts found.</Typography>
        <Typography variant="body2" color="textSecondary">Be the first to create a post!</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ padding: 3 }}>
      <Grid
        container
        direction="column"
        spacing={3}
        justifyContent="center"
        alignItems="center"
      >
        {posts.map((post) => {
          const firstImage = post.images?.[0]?.imageUrl || "/placeholder.jpg"; // Default image if none available
          const isLiked = userLikes[post.id] || false; // Check if post is liked

          return (
            <Grid
              item
              sx={{ width: '100%', maxWidth: '500px' }}
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
                    image={firstImage}
                    sx={{ objectFit: 'cover' }}
                  />
                  <CardContent sx={{ flex: 1, position: 'relative' }}>
                    <Typography variant="h6" gutterBottom>
                      {post.user?.name || "Unknown user"}
                    </Typography>
                    <Typography variant="body2" color="textSecondary">
                      {post.caption || "No caption available"}
                    </Typography>
                    <Typography variant="caption" color="textSecondary" display="block" sx={{ mt: 1 }}>
                      {new Date(post.createdAt).toLocaleString('sk-SK')}
                    </Typography>
                    {/* Clickable like counter */}
                    <Box
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                        display: 'flex',
                        alignItems: 'center',
                        gap: 0.5,
                        cursor: 'pointer',
                      }}
                      onClick={(e) => {
                        e.preventDefault(); // Prevent navigation on click
                        handleLike(post.id, post.likes);
                      }}
                    >
                      <FavoriteIcon 
                        sx={{ 
                          fontSize: 18, 
                          color: isLiked ? 'red' : 'grey' 
                        }} 
                      />
                      <Typography variant="caption">
                        {post.likes}
                      </Typography>
                    </Box>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
