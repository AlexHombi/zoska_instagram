
// src/app/api/auth/[...nextauth]/authOptions.ts

import { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./prisma"

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
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
    async redirect({ url, baseUrl }: { url: string; baseUrl: string }) {
      console.log("Redirecting to:", url, "Base URL:", baseUrl);
  
      // Prevent redirect loops: Only allow internal redirects
      if (!url.startsWith(baseUrl)) {
        return baseUrl; // Fallback to home page
      }
  
      // Ensure we are not redirecting back to sign-in
      if (url.includes("/auth/prihlasenie")) {
        return baseUrl; // Prevent looping
      }
  
      return url; // Otherwise, proceed with normal redirect
    },
  },
  
};