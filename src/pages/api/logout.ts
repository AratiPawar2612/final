import { JWT, getToken } from 'next-auth/jwt';
import { NextRequest, NextResponse } from 'next/server';
import type { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth/next"
import { authOptions } from "./auth/[...nextauth]"

function logoutParams(token: JWT): Record<string, string> {
  console.log("logout parmas : ",token)
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
  const data = await response.json();
  console.log(response.status , data)
  return response
  // return NextResponse.json(response);
}

export default async function (req:any, res:any) {
  console.log("Hiiiiii")

  try {
    const session = await getServerSession(req, res, authOptions)
 
    console.log("Session" ,session)
    const token = session?.refreshToken
    console.log("second session ",session?.refreshToken)
    if (token) {
      console.log("If=====> ", session?.refreshToken)
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

// type Data = {
//   name: string;
// };
// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse<Data>,
// ) {
//   console.log("Hiiiii")
//   try {
//     const token = await getToken({ req });
//     if (token) {
//       return sendEndSessionEndpointToURL(token);
//     }
//     return handleEmptyToken();
//   } catch (error) {
//     console.log(error);
//     const response = {
//       error: 'Unable to logout from the session',
//     };
//     const responseHeaders = {
//       status: 500,
//     };
//     return NextResponse.json(response, responseHeaders);
//   }
// }