"use client";

import Typography from "@mui/material/Typography";
import { Grid, Card, CardContent, CardMedia, Box, TextField, Button } from "@mui/material";
import Link from "next/link";
import { getPosts } from "@/app/actions/posts";
import FavoriteIcon from '@mui/icons-material/Favorite';
import { useState, useEffect } from "react";

// Define the Post type with comments
type Comment = {
  id: string;
  content: string;
  user: { name: string };
  createdAt: string;
};

type Post = {
  id: string;
  caption?: string;
  createdAt: string;
  user?: { name: string };
  likes: number;
  images: { imageUrl: string }[];
  comments: Comment[];
};

export default function PostList() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [userLikes, setUserLikes] = useState<Record<string, boolean>>({});
  const [newComments, setNewComments] = useState<Record<string, string>>({});

  useEffect(() => {
    async function fetchPosts() {
      const { success, posts: fetchedPosts, error } = await getPosts();
      if (success && fetchedPosts) {
        setPosts(fetchedPosts);
        const storedLikes = localStorage.getItem("userLikes");
        setUserLikes(storedLikes ? JSON.parse(storedLikes) : {});
      } else {
        setError(error || "Error loading posts");
      }
      setLoading(false);
    }
    fetchPosts();
  }, []);

  const handleLike = async (postId: string) => {
    setUserLikes((prev) => {
      const updatedLikes = { ...prev, [postId]: !prev[postId] };
      localStorage.setItem("userLikes", JSON.stringify(updatedLikes));
      return updatedLikes;
    });

    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.id === postId
          ? { ...post, likes: userLikes[postId] ? post.likes - 1 : post.likes + 1 }
          : post
      )
    );

    try {
      const response = await fetch(`/api/posts/${postId}/like`, {
        method: userLikes[postId] ? "DELETE" : "POST",
        headers: { "Content-Type": "application/json" },
      });

      if (!response.ok) throw new Error("Failed to update like");

      const data = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId ? { ...post, likes: data.likes } : post
        )
      );
    } catch (err) {
      console.error("Error updating like:", err);
      setUserLikes((prev) => {
        const revertedLikes = { ...prev, [postId]: !prev[postId] };
        localStorage.setItem("userLikes", JSON.stringify(revertedLikes));
        return revertedLikes;
      });
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, likes: userLikes[postId] ? post.likes + 1 : post.likes - 1 }
            : post
        )
      );
    }
  };

  const handleCommentChange = (postId: string, value: string) => {
    setNewComments((prev) => ({ ...prev, [postId]: value }));
  };

  const handleCommentSubmit = async (postId: string) => {
    const commentContent = newComments[postId]?.trim();
    if (!commentContent) return;

    try {
      const response = await fetch(`/api/posts/${postId}/comment`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: commentContent }),
      });

      if (!response.ok) throw new Error("Failed to add comment");

      const newComment = await response.json();
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.id === postId
            ? { ...post, comments: [...post.comments, newComment] }
            : post
        )
      );
      setNewComments((prev) => ({ ...prev, [postId]: "" })); // Clear input
    } catch (err) {
      console.error("Error adding comment:", err);
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
      <Grid container direction="column" spacing={3} justifyContent="center" alignItems="center">
        {posts.map((post) => {
          const firstImage = post.images?.[0]?.imageUrl || "/placeholder.jpg";
          const isLiked = userLikes[post.id] || false;

          return (
            <Grid item sx={{ width: '100%', maxWidth: '500px' }} key={post.id}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  height: 'auto',
                  width: '100%',
                  margin: 'auto',
                  transition: 'transform 0.3s',
                  '&:hover': { transform: 'scale(1.02)' },
                }}
              >
                {/* Only the image is clickable */}
                <Link href={`/prispevok/${post.id}`} passHref style={{ textDecoration: 'none' }}>
                  <CardMedia
                    component="img"
                    alt={post.caption || "Post Image"}
                    height="200"
                    image={firstImage}
                    sx={{ objectFit: 'cover', cursor: 'pointer' }}
                  />
                </Link>

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

                  {/* Like button - Now does not trigger navigation */}
                  <Box
                    sx={{ position: 'absolute', top: 8, right: 8, display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleLike(post.id);
                    }}
                  >
                    <FavoriteIcon sx={{ fontSize: 18, color: isLiked ? 'red' : 'grey' }} />
                    <Typography variant="caption">{post.likes || 0}</Typography>
                  </Box>

                  {/* Comments Section */}
                  <Box sx={{ mt: 2 }}>
                    {post.comments.map((comment) => (
                      <Box key={comment.id} sx={{ mb: 1 }}>
                        <Typography variant="body2">
                          <strong>{comment.user.name}</strong>: {comment.content}
                        </Typography>
                      </Box>
                    ))}
                    <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                      <TextField size="small" placeholder="Add a comment..." value={newComments[post.id] || ""} onChange={(e) => handleCommentChange(post.id, e.target.value)} sx={{ flex: 1 }} onClick={(e) => e.stopPropagation()} />
                      <Button variant="contained" size="small" onClick={(e) => { e.stopPropagation(); handleCommentSubmit(post.id); }}>Post</Button>
                    </Box>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          );
        })}
      </Grid>
    </Box>
  );
}
