import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

import { cn } from "@/lib/utils"
import { buttonVariants } from "@/components/ui/button"
import { UserAuthForm } from "@/app/signin/components/user-auth-form"

export const metadata: Metadata = {
  title: "TableTap - Sign In",
}

export default function SignInPage() {
  return (
    <>
      <div className="container relative h-screen flex-col items-center justify-center grid lg:max-w-none lg:grid-cols-2 lg:px-0">
        <Link
          href="/signup"
          className={cn(
            buttonVariants({ variant: "ghost" }),
            "absolute right-4 top-4 md:right-8 md:top-8"
          )}
        >
          Sign Up
        </Link>
        <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
        <div className="absolute inset-0">
            <Image
            src="/banner.jpg"
            alt="Restaurant Ambiance"
            fill
            style={{ objectFit: 'cover' }}
            priority
            className="opacity-50" 
            />
            <div className="absolute inset-0 bg-black/50" /> {}
        </div>
        
        <div className="relative z-20 flex items-center gap-4">
            <Image 
                src="/logo.png"
                alt="Menu Icon"
                width={40}
                height={40}
                className="object-contain invert brightness-0"
            />
            <h1 className="text-4xl font-bold tracking-tighter drop-shadow-lg">
                Table Tap
            </h1>
        </div>
          <div className="relative z-20 mt-auto">
            <blockquote className="space-y-2">
              <p className="text-lg">
                "Reserve your perfect dining experience with ease."
              </p>
            </blockquote>
          </div>
        </div>
        <div className="lg:p-8">
          <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
            <div className="flex flex-col space-y-2 text-center">
              <h1 className="text-2xl font-semibold tracking-tight">
                Welcome back
              </h1>
              <p className="text-sm text-muted-foreground">
                Enter your email to sign in to your account
              </p>
            </div>
            <UserAuthForm />
            <p className="px-8 text-center text-sm text-muted-foreground">
              <Link
                href="/terms"
                className="underline underline-offset-4 hover:text-primary"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="underline underline-offset-4 hover:text-primary"
              >
                Privacy Policy
              </Link>
              .
            </p>
          </div>
        </div>
      </div>
    </>
  )
}