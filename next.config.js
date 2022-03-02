// next.config.js
// ==============
// https://nextjs.org/docs/api-reference/next.config.js/introduction
//
// IMPORTANT: next.config.js is not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.
//
// Have fun! 🚀

const { wordPressEndpoint } = require( './vip.config' );

// Next.js currently doesn't have a good way to match all paths including the
// root, so we need to use a special regex path.
const allPathsIncludingRoot = '/:path*{/}?';

module.exports = {
	// Base path
	// =========
	// https://nextjs.org/docs/api-reference/next.config.js/basepath
	//
	// Setting a base path is not recommend because it prevents us from serving
	// files at the root, such as 'robots.txt'.
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
		return [
			{
				source: allPathsIncludingRoot,
				destination: `${ wordPressEndpoint }/:path*`,
				has: [
					{
						type: 'query',
						key: 'preview',
						value: 'true',
					},
				],
				permanent: false,
			},
			{
				source: allPathsIncludingRoot,
				destination: `${ wordPressEndpoint }/:path*`,
				has: [
					{
						type: 'query',
						key: 'p',
					},
				],
				permanent: false,
			},
		];
	},

	// Rewrites
	// ========
	// https://nextjs.org/docs/api-reference/next.config.js/rewrites
	async rewrites() {
		return {
			// Since we have a fallback route defined at the root (`[[...slug]].tsx`),
			// we must apply rewrites before any Next.js routing.
			beforeFiles: [
				// Dynamically serve robots.txt.
				{
					source: '/robots.txt',
					destination: '/api/robots',
				},
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

	// Image Optimization
	// ==================
	// https://nextjs.org/docs/basic-features/image-optimization
	//
	// The next/image, is an extension of the HTML <img> element, evolved for
	// the modern web. It includes a variety of built-in performance
	// optimizations to help you achieve good Core Web Vitals.
	images: {
		// If you know the expected device widths of your users, you can specify a
		// list of device width breakpoints using the deviceSizes property here.
		// These widths are used when the next/image component uses layout="responsive"
		// or layout="fill" to ensure the correct image is served for user's device.
		deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
		// The reason there are two separate lists is that imageSizes is only used
		// for images which provide a sizes prop, which indicates that the image
		// is less than the full width of the screen. Therefore, the sizes in
		// imageSizes should all be smaller than the smallest size in deviceSizes.
		imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
	},
};
