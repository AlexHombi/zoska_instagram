"use client";

import { useEffect, useState } from "react";
import { Box, Typography, Avatar, Grid, CircularProgress, Card, CardMedia, CardContent } from "@mui/material";

type Post = {
  id: string;
  caption?: string;
  images: { imageUrl: string }[];
};

type Profile = {
  id: string;
  name: string;
  bio?: string;
  location?: string;
  followersCount: number;
  posts: Post[];
};

export default function ProfilePage({ profilId }: { profilId: string }) {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${profilId}`);
        const data = await res.json();
        setProfile(data);
      } catch (err) {
        console.error("Failed to load profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [profilId]);

  if (loading) return <CircularProgress />;

  if (!profile) return <Typography>Profile not found.</Typography>;

  return (
    <Box sx={{ p: 3 }}>
      <Typography variant="h4">{profile.name}</Typography>
      <Typography variant="subtitle1">{profile.bio || "No bio provided"}</Typography>
      <Typography variant="body2">📍 {profile.location || "Unknown location"}</Typography>
      <Typography variant="body2">👥 {profile.followersCount} followers</Typography>

      <Grid container spacing={2} sx={{ mt: 3 }}>
        {profile.posts.map((post) => (
          <Grid item xs={12} sm={6} md={4} key={post.id}>
            <Card>
              <CardMedia
                component="img"
                height="140"
                image={post.images?.[0]?.imageUrl || "/placeholder.jpg"}
              />
              <CardContent>
                <Typography>{post.caption || "No caption"}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
