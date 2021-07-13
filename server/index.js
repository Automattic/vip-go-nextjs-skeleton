// Next.js custom server
// =====================
// https://nextjs.org/docs/advanced-features/custom-server
//
// IMPORTANT: Custom servers are not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.

const express = require( 'express' );
const next = require( 'next' );
const config = require( '../next.config' );

const dev = 'production' !== process.env.NODE_ENV;

const app = next( { dev } );
const handle = app.getRequestHandler();
const port = parseInt( process.env.PORT, 10 ) || 3000;

app.prepare().then( () => {
	const server = express();

	// Cache healthcheck endpoint
	server.get( '/cache-healthcheck', ( _req, res ) => {
		res.status( 200 ).send( 'Ok' );
	} );

	// Redirect to base path, if configured.
	if ( config.basePath ) {
		server.get( '/', ( _req, res ) => {
			res.redirect( 302, config.basePath );
		} );
	}

	// Serve built assets statically.
	server.use( '/docs/_next', express.static( '.next' ) );

	// Pass all requests to Next.js.
	server.all( '*', ( req, res ) => {
		// Add context from the request that can be picked up by logging.
		const { headers: { referer }, method, url } = req;
		res.locals.requestContext = {
			method,
			referer,
			timestamp: Math.round( Date.now() / 1000 ),
			url,
		};

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
