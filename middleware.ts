import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

// Next.js middleware
// ==================
// https://nextjs.org/docs/middleware

export const middleware: NextMiddleware = ( req: NextRequest ) => {
	// Required health check endpoint on VIP. Do not remove.
	if ( req.nextUrl.pathname === '/cache-healthcheck' ) {
		return new NextResponse( 'Ok' );
	}

	// Returning nothing means the request will continue as normal through the
	// Next.js lifecycle.
}
