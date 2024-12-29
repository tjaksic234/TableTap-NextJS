'use client'
import { Button } from "@/components/ui/button"
import { signOut } from "next-auth/react"

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center justify-between">
          <div className="font-semibold">TableTap</div>
          <nav className="flex items-center space-x-4">
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