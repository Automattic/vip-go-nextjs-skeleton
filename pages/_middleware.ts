import { NextFetchEvent, NextMiddleware, NextRequest, NextResponse } from 'next/server';
import { log } from '@/lib/log';

// Next.js middleware
// ==================
// https://nextjs.org/docs/middleware

export const middleware: NextMiddleware = ( req: NextRequest, event: NextFetchEvent ) => {
	const pathName = req.nextUrl.pathname;

	// Required health check endpoint on VIP. Do not remove.
	if ( pathName === '/cache-healthcheck' ) {
		return new NextResponse( 'Ok' );
	}

	// Ensures that when this response is returned, the Next.js chain will continue
	return NextResponse.next();
}
