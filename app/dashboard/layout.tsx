'use client'
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"
import Image from "next/image"
import Link from "next/link"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-8">
        <div className="max-w-full mx-auto flex h-14 items-center justify-between">
          <div className="flex items-center gap-2">
            <Image 
              src="/logo.png"
              alt="TableTap Logo"
              width={24}
              height={24}
              className="object-contain"
            />
            <Link href="/dashboard" className="flex items-center">
              <span className="text-lg font-semibold">
                Table Tap
              </span>
            </Link>
          </div>
          <nav className="flex items-center">
            <Button 
              variant="ghost" 
              onClick={() => signOut({ callbackUrl: '/signin' })}
            >
              Sign Out
            </Button>
          </nav>
        </div>
      </header>

      <main className="flex-1">{children}</main>
    </div>
  )
}