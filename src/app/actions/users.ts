'use server'

import { prisma } from "@/lib/prisma"

export type User = {
  id: string
  name: string | null
  email: string
  image: string | null
  profile: {
    bio: string | null
    avatarUrl: string | null
  } | null
}

export async function getAllUsers() {
  try {
    const users = await prisma.user.findMany({
      include: {
        profile: true
      },
      orderBy: {
        name: 'asc'
      }
    })

    return { success: true, users }
  } catch (error) {
    console.error('Failed to fetch users:', error)
    return { success: false, error: 'Failed to fetch users' }
  }
}

export async function searchUsers(query: string) {
  try {
    if (!query) {
      return getAllUsers()
    }

    const users = await prisma.user.findMany({
      where: {
        OR: [
          {
            name: {
              contains: query,
              mode: 'insensitive'
            }
          },
          {
            email: {
              contains: query,
              mode: 'insensitive'
            }
          }
        ]
      },
      include: {
        profile: true
      },
      orderBy: {
        name: 'asc'
      },
      take: 10
    })

    return { success: true, users }
  } catch (error) {
    console.error('Failed to search users:', error)
    return { success: false, error: 'Failed to search users' }
  }
} 