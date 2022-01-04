// vip.config.js
// ==============
// IMPORTANT: vip.config.js is not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.
//
module.exports = {
	// Images
	// ======
	// https://developer.wordpress.org/apis/handbook/responsive-images/
	// By default, WordPress returns for all images the srcSet attribute.
	// srcSet is an HTML attribute to specify image resources on responsive websites
	// that use appropriate images for each rendering situation.
	//
	// The next/image, is an extension of the HTML <img> element, evolved for
	// the modern web. It includes a variety of built-in performance
	// optimizations to help you achieve good Core Web Vitals.
	images: {
		// If you want to force usage of the <img /> tag instead of the next/image
		// element, you should set useHtmlTag option to true.
		useHtmlTag: false,
	},
};
