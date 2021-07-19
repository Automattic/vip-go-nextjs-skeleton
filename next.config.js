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

// This is the WordPress preview URL, used to generate a one-time use token and
// redirect back to the Next.js site.
const wordPressPreviewUrl = `${process.env.WORDPRESS_ENDPOINT}/?preview=true&p=:id`;

module.exports = {
	// Base path
	// =========
	// https://nextjs.org/docs/api-reference/next.config.js/basepath
	//
	// If you are using a subdirectory-based multisite instance, you must set the
	// basePath to match the subdirectory of the subsite, e.g., '/path'.
	// Otherwise, leave it set to '' (empty string).
	basePath: '',

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

	// Redirects
	// =========
	// https://nextjs.org/docs/api-reference/next.config.js/redirects
	async redirects() {
		return [
			// Redirect preview requests back to WordPress for token generation.
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
