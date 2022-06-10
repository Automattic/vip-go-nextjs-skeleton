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

	const response = NextResponse.next();

	// For local development, this is where you can optionally insert your own requestID
	// A random UUID would work as well
	if (req.headers.has('x-request-id')) {
		const sourceId = req.headers.get('x-request-id');

		response.headers.set('x-source-id', sourceId);
		response.headers.set('x-request-path', pathName);

		log( 'Middleware has been executed', {}, {sourceId, pathName} );
	}

	// Returning nothing means the request will continue as normal through the
	// Next.js lifecycle.
}
