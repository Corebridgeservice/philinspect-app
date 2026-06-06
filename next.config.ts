import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  // Enable standalone output for Render deployment
  output: 'standalone',

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Ensure server-only modules are not bundled for the client
  serverExternalPackages: ['googleapis', 'google-auth-library'],

  // Allow the Manus preview domain for dev HMR
  allowedDevOrigins: [
    '3000-i6t8voghmoi0jw89h1atm-dee8f447.us2.manus.computer',
    '*.manus.computer',
  ],
};

export default nextConfig;
