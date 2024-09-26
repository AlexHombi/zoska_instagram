import type { Metadata } from "next";
import "./globals.css";


export const metadata: Metadata = {
  title: "Zoška instagram | zoska-instagram",
  description: "Created by Alex",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body >
        {children}
      </body>
    </html>
  );
}
