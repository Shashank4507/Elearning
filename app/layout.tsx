import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type React from "react"
import { Providers } from "@/components/providers"
import { Toaster } from "@/components/ui/sonner"

const inter = Inter({ subsets: ["latin"] })

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.app'
    };
