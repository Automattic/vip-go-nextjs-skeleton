// next.config.js
// ==============
// https://nextjs.org/docs/api-reference/next.config.js/introduction
//
// IMPORTANT: next.config.js is not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.
//
// Have fun! 🚀

// Next.js currently doesn't have a good way to match all paths including the
// root, so we need to use a special regex path.
const allPathsIncludingRoot = '/:path*{/}?';

module.exports = {
	// Base path
	// =========
	// https://nextjs.org/docs/api-reference/next.config.js/basepath
	//
	// If you are using a subdirectory-based multisite instance, you must set the
	// basePath to match the subdirectory of the subsite, e.g., '/path'.
	// Otherwise, leave it set to '' (empty string).
	basePath: '',

	// ESLint
	// ======
	// https://nextjs.org/docs/basic-features/eslint
	eslint: {
		dirs: [
			'components',
			'graphql',
			'lib',
			'pages',
			'server',
		],
		// Warning: Dangerously allow production builds to successfully complete even
		// if your project has ESLint errors. This allows us to keep ESLint as a
		// dev dependency.
		ignoreDuringBuilds: true,
	},

	// Response headers
	// ================
	// https://nextjs.org/docs/api-reference/next.config.js/headers
	async headers() {
		return [
			// The default Cache-Control response headers provided by Next.js out of
			// the box do not work well with VIP's edge cache. This config rule gives
			// every non-static path a max-age of five minutes, providing much better
			// protection from traffic spikes and improving performance overall.
			//
			// Please do not lower this max-age without talking to VIP. :)
			//
			// This header is overwritten when using static-while-revalidate, so please
			// do not set revalidate lower than 300 without talking to VIP. :) :)
			{
				source: allPathsIncludingRoot,
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=300',
					},
				],
			},
		]
	},

	// React strict mode
	// =================
	// https://nextjs.org/docs/api-reference/next.config.js/react-strict-mode
	//
	// Be prepared for future breaking changes in React.
	reactStrictMode: true,

	// Redirects
	// =========
	// https://nextjs.org/docs/api-reference/next.config.js/redirects
	async redirects() {
		// This is the WordPress preview URL, used to generate a one-time use token
		// and redirect back to the Next.js site. If the environment variable
		// WORDPRESS_ENDPOINT is not defined, assume WPGraphQL is using its default
		// endpoint and just peel off /graphql.
		const defaultWordPressEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT.replace( /\/graphql(\?.*)?$/, '/' );
		const wordPressEndpoint = process.env.WORDPRESS_ENDPOINT || defaultWordPressEndpoint;
		const wordPressPreviewUrl = `${wordPressEndpoint}?preview=true&p=:id`;

		return [
			// Redirect preview requests back to WordPress for token generation. We
			// need this redirect because in some WordPress contexts (Gutenberg) the
			// preview URL is not filterable and is sent to HOME by default
			{
				source: allPathsIncludingRoot,
				destination: wordPressPreviewUrl,
				has: [
					{
						key: 'preview',
						type: 'query',
						value: 'true',
					},
					{
						key: 'preview_id',
						type: 'query',
						value: '(?<id>.*)',
					},
				],
				permanent: false,
			},
			// An alternate preview request structure used by WordPress.
			{
				source: allPathsIncludingRoot,
				destination: wordPressPreviewUrl,
				has: [
					{
						key: 'preview',
						type: 'query',
						value: 'true',
					},
					{
						key: 'p',
						type: 'query',
						value: '(?<id>.*)',
					},
				],
				permanent: false,
			},
			// Redirect feed requests to WordPress.
			{
				source: '/:path*/feed',
				destination: `${process.env.WORDPRESS_ENDPOINT}/:path*/feed/`,
				permanent: false,
			},
		];
	},

	// Trailing slash
	// ==============
	// https://nextjs.org/docs/api-reference/next.config.js/trailing-slash
	//
	// By default, WordPress appends trailing slashes to permalinks. Next.js has
	// support for trailing slashes, but its implementation is buggy, causes
	// problems, and is not recommend at this time.
	trailingSlash: false,
};
