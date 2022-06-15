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

	if (req.headers.has( 'x-request-id' ) ) {
		const sourceId = req.headers.get( 'x-request-id' );

		response.headers.set( 'x-source-id', sourceId );
		response.headers.set( 'x-request-path', pathName );

		log( 'Middleware has been executed', {}, { sourceId, pathName } );
	}

	return response;
}
