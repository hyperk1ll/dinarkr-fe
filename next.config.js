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
        // Rewrite to the backend URL, defaulting to the private IP.
        destination: `${process.env.BACKEND_URL || 'http://10.50.0.1:7000/api'}/:path*`
      }
    ];
  },
};