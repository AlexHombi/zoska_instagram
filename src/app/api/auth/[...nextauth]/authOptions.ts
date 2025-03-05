// src/app/api/auth/[...nextauth]/authOptions.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"
import { Adapter } from "next-auth/adapters";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: '/auth/prihlasenie',
    signOut: '/auth/odhlasenie',
  },
  callbacks: {
    async redirect({ url, baseUrl }) {
      // After successful sign in, redirect to /prispevok
      if (url.startsWith(baseUrl)) {
        if (url.includes("/auth/prihlasenie")) {
          return `${baseUrl}/prispevok`; // Redirect to posts after login
        }
        return url; // Allow other internal URLs
      }
      // If the url is not from our site, redirect to the posts page
      return `${baseUrl}/prispevok`;
    },
  },
};