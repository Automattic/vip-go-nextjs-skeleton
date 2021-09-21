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
	// In rare cases, you may want to set the base path. For example, when using a
	// subdirectory-based multisite WordPress, you may want to set `basePath` to
	// match the subdirectory of the subsite, e.g., '/path'.
	//
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

	// Experimental options
	// ====================
	// https://github.com/vercel/next.js/blob/canary/packages/next/server/config-shared.ts
	experimental: {
		// Disable writing to disk in ISR mode. VIP file system is read only, so this
		// avoids generating lots of noisy errors in the logs. ISR artifacts are
		// still cached in-memory.
		isrFlushToDisk: false,
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
		return [];
	},

	// Rewrites
	// ========
	// https://nextjs.org/docs/api-reference/next.config.js/rewrites
	async rewrites() {
		// Dynamically serve robots.txt.
		const robotRewrites = [
			{
				source: '/robots.txt',
				destination: '/api/robots',
			},
		];

		return {
			// Since we have a fallback route defined at the root (`[[...slug]].tsx`),
			// we must apply rewrites before any Next.js routing.
			beforeFiles: [
				...robotRewrites,
			],
		};
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
