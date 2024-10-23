const { withSentryConfig } = require('@sentry/nextjs');

module.exports = {
    serverExternalPackages: ['next-seo'],
    images: {
        domains: [
            'media.wiley.com',
            'images.wiley.com',
            'images.wiley.com.au',
            'images.wiley.com.au.s3.amazonaws.com',
            'learning.oreilly.com',
            'reactjs.org',
            'easings.net',
            'github.com',
            'repository-images.githubusercontent.com',
            'projects-raspberry.com',
            'blog.tensorflow.org',
            'blogger.googleusercontent.com',
            'storage.googleapis.com',
            'images-na.ssl-images-amazon.com',
        ],
    },
    compiler: {
        emotion: true,
    },
};

module.exports = withSentryConfig(
    module.exports,
    { silent: true },
    { hideSourcemaps: true }
);
