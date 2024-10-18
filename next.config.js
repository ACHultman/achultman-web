// This file sets a custom webpack configuration to use your Next.js app
// with Sentry.
// https://nextjs.org/docs/api-reference/next.config.js/introduction
// https://docs.sentry.io/platforms/javascript/guides/nextjs/manual-setup/
const { withSentryConfig } = require('@sentry/nextjs');

module.exports = {
    experimental: {
        serverComponentsExternalPackages: ['next-seo'],
    },
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
