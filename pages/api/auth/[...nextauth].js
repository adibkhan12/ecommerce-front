import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { MongoDBAdapter } from "@auth/mongodb-adapter";
import client from "@/lib/db";

export const authOptions = {

    providers: [
        GoogleProvider({
            clientId: process.env.GOOGLE_FRONT_ID,
            clientSecret: process.env.GOOGLE_FRONT_SECRET,
        }),
    ],
    adapter: MongoDBAdapter(client),
};

export default NextAuth(authOptions);
