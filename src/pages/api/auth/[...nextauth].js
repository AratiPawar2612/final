import NextAuth from "next-auth";
import KeycloakProvider from 'next-auth/providers/keycloak';



export const authOptions = {
 
  providers: [
    
    KeycloakProvider({
      clientId: process.env.KEYCLOAK_CLIENT_ID,
      clientSecret: process.env.KEYCLOAK_CLIENT_SECRET,
      issuer: process.env.KEYCLOAK_ISSUER,
    }),
  ],
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      console.log(account, " account ",token)
      if (account) {
        token.accessToken = account.access_token;
        token.idToken = account.id_token;
        token.refreshToken = account.refresh_token; 
        token.expiresAt = account.expires_at;
      }
      return token
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken
      session.refreshToken=token.refreshToken
      session.error = token.error;
      return session
    },
    async refreshToken({ token, account, isNewSession }) {
      
      const response = await fetch(`${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          grant_type: 'refresh_token',
          refresh_token: token.refreshToken,
          client_id: process.env.KEYCLOAK_CLIENT_ID,
          client_secret: process.env.KEYCLOAK_CLIENT_SECRET,
        }),
      });
      const data = await response.json();
      if (!response.ok) {
        throw new Error('Failed to refresh token');
      }
      console.log("refresh : ",token);
      return {
        ...token,
        accessToken: data.access_token,
        accessTokenExpires: Date.now() + data.expires_in * 1000,
        refreshToken: data.refresh_token ?? token.refreshToken, // Use existing refresh token if not returned
        
      };
    }
  }
}

export default NextAuth(authOptions)