import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

// Edge-safe config — no Prisma, no bcrypt
// Used only in proxy.ts for JWT session reading
export default {
    providers: [
        Credentials({
            credentials: {},
            async authorize() {
                return null; // actual auth happens in auth.ts
            },
        }),
    ],
    callbacks: {
        jwt({ token, user }) {
            if (user) {
                token.id = (user as { id?: string }).id;
                token.storeId = (user as { storeId?: string | null }).storeId ?? null;
            }
            return token;
        },
        session({ session, token }) {
            if (token && session.user) {
                session.user.id = token.id as string;
                (session.user as { storeId?: string | null }).storeId =
                    token.storeId as string | null;
            }
            return session;
        },
    },
    pages: {
        signIn: "/login",
        error: "/login",
    },
    session: {
        strategy: "jwt",
    },
} satisfies NextAuthConfig;
