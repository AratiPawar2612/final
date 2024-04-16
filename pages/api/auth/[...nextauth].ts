import axios from "axios";
import NextAuth from "next-auth";
import KeycloakProvider from "next-auth/providers/keycloak";

export const authOptions = {
  providers: [
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID || "",
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET || "",
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, user, account }: any) {
      const { exp } = token;

      if (account) {
        const { refresh_token, access_token } = account;
        return { ...token, ...user, refresh_token, access_token };
      } else if (exp) {
        const isValidToken = Date.now() < exp * 1000;
        if (isValidToken) {
          return { ...token, ...user };
        } else {
          const { refresh_token } = token;
          if (refresh_token) {
            const requestData = new URLSearchParams({
              grant_type: "refresh_token",
              refresh_token: refresh_token,
              client_id: process.env.KEYCLOAK_CLIENT_ID || "",
              client_secret: process.env.KEYCLOAK_CLIENT_SECRET || "",
            });

            try {
              const response = await axios.post(
                `${process.env.KEYCLOAK_CLIENT_SECRET}/protocol/openid-connect/token`,
                requestData,
                {
                  headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                  },
                }
              );
              const { data } = response;
              return {
                ...token, // Keep the previous token properties
                ...user,
                access_token: data.access_token,
                expires_at: Math.floor(Date.now() / 1000 + data.expires_in),
                // Fall back to old refresh token, but note that
                // many providers may only allow using a refresh token once.
                refresh_token: data.refresh_token ?? token.refresh_token,
              };
            } catch (error) {
              throw Error("Please relogin again");
            }
          } else {
            throw Error("Please relogin again");
          }
        }
      } else {
        return { ...token, ...user };
      }
    },
    async session({ session, token, user }: any) {session.access_token = token.access_token;
      session.refresh_token = token.refresh_token;
      return session;
},
  },
};

export default NextAuth(authOptions);
