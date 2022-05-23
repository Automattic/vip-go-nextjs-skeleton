// Next.js custom server
// =====================
// https://nextjs.org/docs/advanced-features/custom-server
//
// IMPORTANT: Custom servers are not parsed by Webpack, Babel, or Typescript.
// Avoid language features that are not available in your target Node.js version.
// Do not change the file extenstion to .ts.

/* eslint-disable @typescript-eslint/no-var-requires */
require( 'dotenv' ).config();
const express = require( 'express' );
const next = require( 'next' );

const dev = 'production' !== process.env.NODE_ENV;
const hostname = 'localhost';
const port = parseInt( process.env.PORT, 10 ) || 3000;

const app = next( { dev, hostname, port } );
const handle = app.getRequestHandler();

app.prepare().then( () => {
	const server = express();

	// Cache healthcheck endpoint
	server.get( '/cache-healthcheck', ( _req, res ) => {
		res.status( 200 ).send( 'Ok' );
	} );

	// Serve built assets statically.
	server.use( '/docs/_next', express.static( '.next' ) );

	// Pass all remaining requests to Next.js.
	server.all( '*', ( req, res ) => {
		handle( req, res );
	} );

	// Start listening.
	server.listen( port, ( err ) => {
		if ( err ) {
			throw err;
		}

		console.log( `[READY] 🌐 Ready on http://${hostname}:${port}` );
	} );
} );
