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

	server.use( '/docs/_next', express.static( '.next' ) );

	server.all( '*', handle );

	server.listen( port, ( err ) => {
		if ( err ) {
			throw err;
		}

		console.log(`> Ready on http://localhost:${port}`);
	} );
} );
