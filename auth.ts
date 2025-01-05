import type { NextAuthConfig } from "next-auth";
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

const credentialsConfig = Credentials({
    name: "Credentials",
    credentials: {
        email: {
            label: "email",
        },
        password: {
            label: "password",
            type: "password",
        }
    },
    async authorize(credentials) {

        try {
            const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
                method: "POST",
                headers: {
                  "Content-Type": "application/json",
                },
                body: JSON.stringify(credentials),
              });

            console.log(res)
    
            if (!res.ok) {
                throw new Error("Login failed");
            }
    
            const data = await res.json();
            
            return {
                id: credentials.email,
                email: credentials.email,
                accessToken: data.accessToken 
            };

        } catch (error) {
            console.error('Auth error:', error);
            return null;
        }
        
    },
})

const config = {
    providers: [
        credentialsConfig
    ],

    session: {
        strategy: "jwt",
        maxAge: 24 * 60 * 60
    },

    callbacks: {

        async jwt({ token, user }) {
            console.log('JWT Callback - Incoming token:', token);
            console.log('JWT Callback - Incoming user:', user);
            if (user) {
                token.accessToken = user.accessToken;
                token.email = user.email;
            }
            console.log('JWT Callback - Returned token:', token);
            return token;
        },
        async session({ session, token }) {
            console.log('Session Callback - Incoming session:', session);
            console.log('Session Callback - Incoming token:', token);
            session.user.email = token.email;
            session.accessToken = token.accessToken;
            console.log('Session Callback - Returned session:', session);
            return session;
        },
        
    },

    pages: {
        signIn: "/signin",
    },
    
} satisfies NextAuthConfig;

export const {handlers, auth, signIn, signOut} = NextAuth(config)