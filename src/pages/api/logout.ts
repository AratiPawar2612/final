// Import 'NextApiRequest' from the correct package
import { NextApiRequest, NextApiResponse } from 'next';

// Import 'destroyCookie' for clearing cookies
import { destroyCookie } from 'nookies';

function logoutParams(token: any): Record<string, string> {
  return {
    id_token_hint: token.idToken as string,
    post_logout_redirect_uri: process.env.NEXTAUTH_URL ?? '',
  };
}

function handleEmptyToken() {
  const response = { error: 'No session present' };
  const responseHeaders = { status: 400 };
  return response; // Return response directly without using NextResponse.json
}

async function logoutUser(req: NextApiRequest, res: NextApiResponse) {
  // Clear session data or cookies
  destroyCookie({ res }, 'your_session_cookie_name'); // Corrected syntax
}

function sendEndSessionEndpointToURL(token: any) {
  const endSessionEndPoint = new URL(
    `${process.env.KEYCLOAK_ISSUER}/protocol/openid-connect/logout`,
  );
  const params: Record<string, string> = logoutParams(token);
  const endSessionParams = new URLSearchParams(params);
  const response = { url: `${endSessionEndPoint.href}/?${endSessionParams}` };
  return response; // Return response directly without using NextResponse.json
}

export async function GET(req: NextApiRequest, res: NextApiResponse) {
  try {
    const sessionresponse = await fetch('/api/getsession');
    const sessionData = await sessionresponse.json();
    console.log('Session Data:', sessionData?.session?.accessToken);
   
   // const token = await getToken({ req });
    if (sessionData?.session?.accessToken) {
      // Logout the user
      await logoutUser(req, res);
      
      // Once user is logged out, send end session endpoint URL
      const endSessionResponse = sendEndSessionEndpointToURL(sessionData?.session?.accessToken);
      return endSessionResponse; // Return response directly without using NextResponse.json
    }
    return handleEmptyToken();
  } catch (error) {
    console.error(error);
    const response = {
      error: 'Unable to logout from the session',
    };
    const responseHeaders = {
      status: 500,
    };
    return response; // Return response directly without using NextResponse.json
  }
}
