import "next-auth";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { JWT } from "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken?: string;
    user: {
      id: string;
      email?: string;
    } & DefaultSession["user"];
  }

  interface User {
    id: string;
    email: string;
    accessToken?: string;
  }
}


declare module "next-auth/jwt" {
    interface JWT {
      id: string;
      email: string;
      accessToken?: string;
    }
}