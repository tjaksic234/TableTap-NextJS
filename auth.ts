import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const credentialsConfig = Credentials({
    name: "Credentials",
    credentials: {
        email: {
            label: "email"
        },
        password: {
            label: "password",
            type: "password",
        }
    },
    async authorize(credentials) {
        if(credentials.email === "john.doe@gmail.com" && credentials.password === "123") {
            return {
                id: 1,
                email: credentials.email,
                name: "John Doe"
            }
        }
        return null;
    },
})

const config = {
    providers: [
        credentialsConfig
    ],
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config)