module.exports = {
    serverExternalPackages: ['next-seo'],
    images: {
        remotePatterns: [
            {
                protocol: 'https',
                hostname: 'media.wiley.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.wiley.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.wiley.com.au',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images.wiley.com.au.s3.amazonaws.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'learning.oreilly.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'reactjs.org',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'easings.net',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'github.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'repository-images.githubusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'projects-raspberry.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'blog.tensorflow.org',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'blogger.googleusercontent.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'storage.googleapis.com',
                port: '',
                pathname: '/**',
            },
            {
                protocol: 'https',
                hostname: 'images-na.ssl-images-amazon.com',
                port: '',
                pathname: '/**',
            },
        ],
    },
    // Add Cache-Control header to avoid no-store and enable back/forward cache (bfcache) on static pages
    async headers() {
        return [
            {
                source: '/:path*',
                headers: [
                    {
                        key: 'Cache-Control',
                        value: 'public, max-age=0, must-revalidate',
                    },
                ],
            },
        ];
    },
    compiler: {
        emotion: true,
    },
};
