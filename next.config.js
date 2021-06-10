module.exports = {
	// If you are using a subdirectory-based multisite instance, you must set the
	// basePath to match the subdirectory of the subsite, e.g., '/path'.
	// Otherwise, leave it set to '' (empty string).
	basePath: '',
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
	async redirects() {
    return [
			// Redirect preview requests back to WordPress for token generation.
			{
				source: '/:path*{/}?', // matches all paths, including root
				destination: `${process.env.WORDPRESS_ENDPOINT}/?preview=true&p=:id`,
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
				source: '/:path*{/}?', // matches all paths, including root
				destination: `${process.env.WORDPRESS_ENDPOINT}/?preview=true&p=:id`,
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
	// By default, WordPress to append trailing slashes to permalinks. Next.js has
	// support for trailing slashes, but its implementation is buggy, causes
	// problems, and is not recommend at this time.
	trailingSlash: false,
};
