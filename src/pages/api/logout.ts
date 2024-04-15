// ./src/pages/api/logout.ts

import { JWT } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

function logoutParams(token: JWT): Record<string, string> {
  console.log("logout params : ",token)
  //const idToken = token.idToken || ''; // Provide a default empty string if idToken is undefined
  console.log("token "+token)
  return {
    refresh_token: token.toString(),
    client_id: process.env.KEYCLOAK_CLIENT_ID || '',// Ensure idToken is converted to a string
    client_secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
    post_logout_redirect_uri: process.env.NEXTAUTH_URL || '', // Provide a default value for NEXTAUTH_URL if it's undefined
  };
}

function handleEmptyToken() {
  const response = { error: 'No session present' };
  const responseHeaders = { status: 400 };
  return NextResponse.json(response, responseHeaders);
}

async function sendEndSessionEndpointToURL(token: JWT) {
  console.log("sendEndSessionEndpointToURL :" ,token)
  const endSessionEndPoint = new URL(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
  );
  console.log("1   ===> ");
  const params: Record<string, string> = logoutParams(token);
  const endSessionParams = new URLSearchParams(params);
  // const response = { url: `${endSessionEndPoint.href}/?${endSessionParams}` };
  const response = await fetch(`${endSessionEndPoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: new URLSearchParams({
      //grant_type: 'refresh_token',
      refresh_token: token.toString(),
      client_id: process.env.KEYCLOAK_CLIENT_ID || '',// Ensure idToken is converted to a string
      client_secret: process.env.KEYCLOAK_CLIENT_SECRET || '',
      post_logout_redirect_uri: process.env.NEXTAUTH_URL || '',
    }),
  });
  
  return response
  // return NextResponse.json(response);
}

export async function logoutHandler(req: NextApiRequest, res: NextApiResponse) {
  console.log("Hiiiiii")

  try {
    const session = await getServerSession(req, res, authOptions)
 
    console.log("Session" ,session)
    const token = session?.refreshToken
    console.log("second session ",session?.refreshToken)
    if (token) {
    
      sendEndSessionEndpointToURL(token);
      return res.status(200).json({ success: true });
    }
    return handleEmptyToken();
  } catch (error) {
    console.log(error);
    const response = {
      error: 'Unable to logout from the session',
    };
    const responseHeaders = {
      status: 500,
    };
    return NextResponse.json(response, responseHeaders);
  }
}
