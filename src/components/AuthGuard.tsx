// src/components/AuthGuard.tsx

import { getServerSession } from "next-auth";
import { permanentRedirect } from 'next/navigation'
import { authOptions } from "@/app/api/auth/[...nextauth]/authOptions";

export async function AuthGuard({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions)


    if (!session) {
        permanentRedirect("/auth/prihlasenie")
    }
    else {
        return (
            <div>
                {children}
            </div>
        )
    }

   
}