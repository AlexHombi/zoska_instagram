'use client'

// src/app/hladanie/page.tsx

import { useState, useEffect } from 'react'
import { 
  Box, 
  TextField, 
  Typography, 
  Avatar,
  Card,
  CardContent,
  Grid,
  CircularProgress
} from '@mui/material'
import { searchUsers, getAllUsers, type User } from '@/app/actions/users'
import Link from 'next/link'
import debounce from 'lodash/debounce'

export default function SearchPage() {
  const [query, setQuery] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Load all users on initial render
  useEffect(() => {
    const loadUsers = async () => {
      try {
        const result = await getAllUsers()
        if (result.success) {
          setUsers(result.users || [])
        } else {
          setError(result.error || 'Failed to load users')
        }
      } catch (err) {
        setError('Failed to load users')
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Debounced search function
  const debouncedSearch = debounce(async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      // Load all users when search is cleared
      const result = await getAllUsers()
      if (result.success) {
        setUsers(result.users || [])
      }
      return
    }

    setLoading(true)
    try {
      const result = await searchUsers(searchQuery)
      if (result.success) {
        setUsers(result.users || [])
        setError('')
      } else {
        setError(result.error || 'Failed to search users')
        setUsers([])
      }
    } catch (err) {
      setError('An error occurred while searching')
      setUsers([])
    } finally {
      setLoading(false)
    }
  }, 300)

  useEffect(() => {
    debouncedSearch(query)
    return () => {
      debouncedSearch.cancel()
    }
  }, [query])

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" gutterBottom>
        Hľadať používateľov
      </Typography>

      <TextField
        fullWidth
        variant="outlined"
        placeholder="Zadajte meno používateľa..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        sx={{ mb: 3 }}
      />

      {loading && (
        <Box display="flex" justifyContent="center" my={2}>
          <CircularProgress />
        </Box>
      )}

      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      <Grid container spacing={2}>
        {users.map((user) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={user.id}>
            <Link href={`/profil/${user.id}`} style={{ textDecoration: 'none' }}>
              <Card sx={{ 
                display: 'flex', 
                alignItems: 'center',
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[4]
                }
              }}>
                <Avatar
                  src={user.profile?.avatarUrl || user.image || undefined}
                  sx={{ 
                    width: 60, 
                    height: 60, 
                    m: 2,
                    bgcolor: 'primary.main'
                  }}
                >
                  {user.name?.charAt(0) || user.email.charAt(0)}
                </Avatar>
                <CardContent>
                  <Typography variant="subtitle1" fontWeight="medium">
                    {user.name || 'Unnamed User'}
                  </Typography>
                  {user.profile?.bio && (
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      noWrap 
                      sx={{ maxWidth: 200 }}
                    >
                      {user.profile.bio}
                    </Typography>
                  )}
                </CardContent>
              </Card>
            </Link>
          </Grid>
        ))}
      </Grid>

      {!loading && users.length === 0 && (
        <Typography sx={{ mt: 2, textAlign: 'center' }}>
          No users found
        </Typography>
      )}
    </Box>
  )
}