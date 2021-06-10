module.exports = {
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
				source: '/:path*{/}?', // matches all paths, including root
				headers: [
					{
						key: 'Cache-Control',
						value: 'public, max-age=300',
					},
				],
			},
		]
	},
	async rewrites() {
		return [
			// Cache healthcheck endpoint is required on VIP.
			{
				source: '/cache-healthcheck',
				destination: '/api/cache-healthcheck',
			},
			// Proxy feed requests to WordPress.
			{
				source: '/:path*/feed',
				destination: `${process.env.WORDPRESS_ENDPOINT}/:path*/feed/`,
			},
		]
	},
	// By default, WordPress to append trailing slashes to permalinks. Next.js has
	// support for trailing slashes, but its implementation is buggy, causes
	// problems, and is not recommend at this time. Most notably, it will not
	// easily allow the `/cache-healthcheck` endpoint to be served without a
	// trailing slash. Please leave this settting to its default, `false`. :)
	trailingSlash: false,
};
