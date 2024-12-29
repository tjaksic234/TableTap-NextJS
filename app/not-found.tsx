"use client"
import Link from 'next/link'
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"

export default function NotFound() {
  return (
    <div className="h-screen w-full flex items-center justify-center">
      <Card className="w-[420px]">
        <CardHeader>
          <CardTitle className="text-4xl flex items-center gap-4">
            <span className="text-muted-foreground">404</span>
            <span className="text-xl">|</span>
            <span>Not Found</span>
          </CardTitle>
          <CardDescription>
            Oops! The page you're looking for doesn't exist or has been moved.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            The table you're trying to reserve might have been moved or doesn't exist. 
            Please check the URL or navigate back to the homepage.
          </p>
        </CardContent>
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => window.history.back()}>
            Go Back
          </Button>
          <Button asChild>
            <Link href="/signin">Return to Sign In</Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  )
}