/** @type {import('next').NextConfig} */
const nextConfig = {
  // Don't let `next dev` write an AGENTS.md into the project.
  agentRules: false,
  // A self-contained server in .next/standalone that runs with plain `node server.js` on the phone.
  output: "standalone",
  // The app uses no next/image, so there's nothing to optimize.
  images: { unoptimized: true },
  // Built with NEXT_PUBLIC_HOST=/api, the browser only ever talks to this server, which hands API calls to
  // Django on the same machine. Only the app's own endpoints are passed on: Django's admin and token views
  // stay unreachable from outside. Nothing in dev uses /api, so `next dev` against its own backend is unaffected.
  async rewrites() {
    return [
      { source: "/api/home/:path*", destination: "http://127.0.0.1:8000/home/:path*" },
      { source: "/api/type/:path*", destination: "http://127.0.0.1:8000/type/:path*" },
    ];
  },
};

export default nextConfig;
