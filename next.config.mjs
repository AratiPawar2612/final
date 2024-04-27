/** @type {import('next').NextConfig} */

import * as dotenv from "dotenv";

dotenv.config();

const nextConfig = {
  reactStrictMode: true,
  env: {
    KEYCLOAK_CLIENT_ID: process.env.KEYCLOAK_CLIENT_ID,
    KEYCLOAK_CLIENT_SECRET: process.env.KEYCLOAK_CLIENT_SECRET,
    KEYCLOAK_ISSUER: process.env.KEYCLOAK_ISSUER,
    NEXTAUTH_SECRET:process.env.NEXTAUTH_SECRET,
    // NEXTAUTH_URL:process.env.NEXTAUTH_URL,
    NEXTAUTH_URL: process.env.NODE_ENV === 'production' ? process.env.NEXTAUTH_URL_PROD : process.env.NEXTAUTH_URL_DEV,

  },
  transpilePackages: [
    "@ant-design",
    "rc-util",
    "rc-pagination",
    "rc-picker",
    "rc-tree",
    "rc-table",
  ],
};

export default nextConfig;
