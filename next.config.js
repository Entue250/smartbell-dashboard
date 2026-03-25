/** @type {import('next').NextConfig} */
const nextConfig = {
    // Allow images from the RPi backend if needed
    images: {
        remotePatterns: [],
    },

    // Proxy API calls in development to avoid CORS issues
    // In production on the same network, direct calls work fine
    async rewrites() {
        const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
        return [
            // Uncomment below to proxy API calls through Next.js dev server (optional)
            {
                source: '/api/:path*',
                destination: `${apiUrl}/api/:path*`,
            },
        ];
    },
};

module.exports = nextConfig;