import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: NextRequest,
  { params }: { params: { profilId: string } }
) {
  const { profilId } = params;

  try {
    const user = await prisma.user.findUnique({
      where: { id: profilId }, // or username: profilId if using usernames
      include: {
        posts: {
          select: {
            id: true,
            caption: true,
            images: true, // assuming `images` is a related field
          },
        },
        followers: true, // optional: or use _count if you just want the count
      },
    });

    if (!user) {
      return new Response(JSON.stringify({ error: "User not found" }), { status: 404 });
    }

    const responseData = {
      id: user.id,
      name: user.name,
      followersCount: user.followers.length,
      posts: user.posts,
    };

    return new Response(JSON.stringify(responseData), { status: 200 });
  } catch (error) {
    console.error("Error fetching user:", error);
    return new Response(JSON.stringify({ error: "Internal server error" }), { status: 500 });
  }
}
