// next.config.js
module.exports = {
  output: 'standalone',
  images: {
    domains: ['drive.google.com', 'dinarkr.com'],
  },
  async rewrites() {
    return [
      {
        source: '/api-proxy/:path*',
        // We use the VPS public URL as the fallback since 10.50.0.1 might be unreachable from inside the Next.js Docker container.
        destination: `${process.env.BACKEND_URL || 'http://vps1.hype-lab.cloud:7000/api'}/:path*`
      }
    ];
  },
};