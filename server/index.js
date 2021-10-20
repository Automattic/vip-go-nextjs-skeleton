// Next.js custom server
// =====================
// https://nextjs.org/docs/advanced-features/custom-server
//
// IMPORTANT: Custom servers are not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.

require( 'dotenv' ).config();
const express = require( 'express' );
const { createProxyMiddleware } = require( 'http-proxy-middleware' );
const next = require( 'next' );
const config = require( '../next.config' );

const dev = 'production' !== process.env.NODE_ENV;

const app = next( { dev } );
const handle = app.getRequestHandler();
const port = parseInt( process.env.PORT, 10 ) || 3000;

/**
 * If the environment variable NEXT_PUBLIC_WORDPRESS_ENDPOINT is not defined,
 * assume WPGraphQL is using its default endpoint and just peel off /graphql.
 */
const defaultWordPressEndpoint = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT.replace( /\/graphql(\?.*)?$/, '/' );
const wordPressEndpoint = process.env.NEXT_PUBLIC_WORDPRESS_ENDPOINT || defaultWordPressEndpoint;

/*
 * Create a simple proxy to fetch some resources, like sitemaps and feeds, from
 * WordPress.
 */
const wpProxy = createProxyMiddleware( {
	changeOrigin: true,
	followRedirects: true, // if you'd rather serve redirects to the user, consider autoRewrite instead
	target: wordPressEndpoint,
} );

app.prepare().then( () => {
	const server = express();

	// Cache healthcheck endpoint
	server.get( '/cache-healthcheck', ( _req, res ) => {
		res.status( 200 ).send( 'Ok' );
	} );

	// Proxy sitemap requests to WordPress. The middleware below proxies any XML
	// or XSL file that contains the word "sitemap". Wrapping wpProxy in a function
	// allows us to inspect the request and exclude those that don't match this
	// condition.
	server.use( '*.x[ms]l', function( req, res, next ) {
		// Note the use of "req.baseUrl" to get the URL of the request before it was
		// matched by "server.use"; req.url and req.path will always be "/".
		if ( /\bsitemap\b/.test( req.baseUrl ) ) {
			return wpProxy( req, res, next );
		}

		next();
	} );

	// Proxy feed requests to WordPress.
	server.use( /.*\/feed\/?$/, wpProxy );

	// Redirect preview requests back to WordPress. Once there, the VIP Decoupled
	// plugin will generate a one-time-use token and redirect back to this site. We
	// need to use this double-redirection because in some WordPress contexts
	// (Gutenberg) the preview URL is not filterable and we cannot intercept it to
	// inject the token.
	server.get( '*', ( req, res, nextMiddleware ) => {
		if ( 'true' === req.query.preview && req.query.preview_id || req.query.p ) {
			const query = req.url.substr( req.url.indexOf( '?' ) );
			return res.redirect( 302, `${wordPressEndpoint}${query}` );
		}

		nextMiddleware();
	} );

	// Redirect to base path, if configured.
	if ( config.basePath ) {
		server.get( '/', ( _req, res ) => {
			res.redirect( 302, config.basePath );
		} );
	}

	// Serve built assets statically.
	server.use( '/docs/_next', express.static( '.next' ) );

	// Pass all remaining requests to Next.js.
	server.all( '*', ( req, res ) => {
		// Add context from the request that can be picked up by our code.
		const { headers: { referer }, method, url } = req;
		const requestContext = {
			method,
			referer,
			timestamp: Math.round( Date.now() / 1000 ),
			url,
		};

		Object.assign( res.locals, { requestContext, wordPressEndpoint } );

		handle( req, res );
	} );

	// Start listening.
	server.listen( port, ( err ) => {
		if ( err ) {
			throw err;
		}

		console.log( `[READY] 🌐 Ready on http://localhost:${port}` );
	} );
} );
