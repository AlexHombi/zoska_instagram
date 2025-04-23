"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  Box,
  Typography,
  Avatar,
  Grid,
  CircularProgress,
  Card,
  CardMedia,
  CardContent,
} from "@mui/material";

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

export default function ProfilePage() {
  const { profilId } = useParams();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);0

  useEffect(() => {
    if (!profilId) return;

    async function fetchProfile() {
      try {
        const res = await fetch(`/api/profile/${profilId}`);
        const data = await res.json();
        console.log("Fetched profile:", data); // 👈 Debugging output
        setProfile(data);
      } catch (err) {
        console.error("Failed to fetch profile:", err);
      } finally {
        setLoading(false);
      }
    }

    fetchProfile();
  }, [profilId]);

  if (loading) {
    return (
      <Box sx={{ p: 4, textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  if (!profile) {
    return <Typography sx={{ p: 4 }}>Profile not found.</Typography>;
  }

  return (
    <Box sx={{ p: 3 }}>
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 2 }}>
        <Avatar sx={{ width: 64, height: 64 }}>
          {profile.name?.charAt(0) ?? "?"}
        </Avatar>
        <Box>
          <Typography variant="h5">{profile.name}</Typography>
          <Typography variant="body2" color="textSecondary">
            {profile.location || "Unknown location"}
          </Typography>
          <Typography variant="body2">
            {profile.followersCount} followers
          </Typography>
        </Box>
      </Box>

      {profile.bio && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle1">Bio:</Typography>
          <Typography variant="body2">{profile.bio}</Typography>
        </Box>
      )}

      <Box>
        <Typography variant="h6" gutterBottom>
          Posts
        </Typography>
        <Grid container spacing={2}>
          {profile.posts && profile.posts.length > 0 ? (
            profile.posts.map((post) => (
              <Grid item key={post.id} xs={12} sm={6} md={4}>
                <Card>
                  <CardMedia
                    component="img"
                    height="140"
                    image={post.images?.[0]?.imageUrl || "/placeholder.jpg"}
                    alt="Post image"
                  />
                  <CardContent>
                    <Typography variant="body2" noWrap>
                      {post.caption || "No caption"}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            ))
          ) : (
            <Typography>No posts available</Typography>
          )}
        </Grid>
      </Box>
    </Box>
  );
}
