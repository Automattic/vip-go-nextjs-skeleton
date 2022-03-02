// vip.config.js
// ==============
// IMPORTANT: vip.config.js is not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.

// If the environment variable NEXT_PUBLIC_WORDPRESS_ENDPOINT is not defined,
// assume WPGraphQL is using its default endpoint and just peel off /graphql.
let wordPressEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT.replace( /\/graphql(\?.*)?$/, '' );
if ( process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT ) {
	wordPressEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT;
}

module.exports = {
	// Images
	// ======
	// https://developer.wordpress.org/apis/handbook/responsive-images/
	//
	// By default, WordPress returns for all images the srcSet attribute.
	// srcSet is an HTML attribute to specify image resources on responsive websites
	// that use appropriate images for each rendering situation.
	//
	// https://nextjs.org/docs/api-reference/next/image
	//
	// The next/image, is an extension of the HTML <img> element, evolved for
	// the modern web. It includes a variety of built-in performance
	// optimizations to help you achieve good Core Web Vitals.
	images: {
		// If you want to force usage of the <img /> tag instead of the next/image
		// element, you should set useHtmlTag option to true.
		useHtmlTag: false,
	},

	// The WordPress endpoint used for previewing, sitemaps, and other
	// functionality that we don't want to replicate in Next.js.
	wordPressEndpoint,
};
