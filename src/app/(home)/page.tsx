// src/app/page.tsx


import { getServerSession } from "next-auth";
import { authOptions } from "../api/auth/[...nextauth]/authOptions";
import AuthHomeView from "../../sections/AuthHomeView";
import NonAuthHomeView from "../../sections/NonAuthHomeView";

export const metadata = { title: "Domov | ZoškaSnap" };

export default async function HomePage() {
  // Fetch session on the server
  const session = await getServerSession(authOptions);

  // Conditionally render authenticated or non-authenticated home view
  return session ? <AuthHomeView session={session} /> : <NonAuthHomeView />;
}


