// src\app\(private)\layout.tsx

import { AuthGuard } from "@/components/AuthGuard"


export default function PrivateLayout({
    children, // will be a page or nested layout
  }: {
    children: React.ReactNode
  }) {

    return (
        
      <section>
        <AuthGuard>
            {children}
        </AuthGuard>
      </section>
    )
  }