import { NextMiddleware, NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/log';

// Next.js middleware
// ==================
// https://nextjs.org/docs/middleware

export const middleware: NextMiddleware = ( req: NextRequest ) => {
	const pathName = req.nextUrl.pathname;

	// Required health check endpoint on VIP. Do not remove.
	if ( pathName === '/cache-healthcheck' ) {
		return new NextResponse( 'Ok' );
	}

	// Ensures that when this response is returned, the Next.js chain will continue
	const response = NextResponse.next();
	const reqHeaderName = 'x-request-id';


	if ( req.headers.has( reqHeaderName ) ) {
		const sourceId = req.headers.get( reqHeaderName );

		// Calling it sourceID allows to be differenciated from the requestID
		// and potentially be sent to the WP backend alongside each WP query
		response.headers.set( 'x-source-id', sourceId );
		response.headers.set( 'x-request-path', pathName );

		log( 'Middleware has been executed', { }, { sourceId, pathName } );
	}

	return response;
}
