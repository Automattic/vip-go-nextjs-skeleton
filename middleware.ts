import { NextMiddleware, NextRequest, NextResponse } from 'next/server';

// Next.js middleware
// ==================
// https://nextjs.org/docs/middleware

export const middleware: NextMiddleware = ( req: NextRequest ) => {
	// Remove x-middleware-prefetch header to prevent VIP's infrastructure
	// from caching empty JSON responses on prefetched data for SSR pages. See the following URLs for more info:
	// https://github.com/vercel/next.js/discussions/45997
	// https://github.com/vercel/next.js/pull/45772
	// https://github.com/vercel/next.js/blob/v13.1.1/packages/next/server/base-server.ts#L1069
	const headers = new Headers(req.headers);
  headers.delete('x-middleware-prefetch');

	// Required health check endpoint on VIP. Do not remove.
	if ( req.nextUrl.pathname === '/cache-healthcheck' ) {
		return NextResponse.rewrite( new URL( '/api/healthcheck', req.url ) );
	}

	// Continue as normal through the Next.js lifecycle.
	return NextResponse.next({
    request: {
      headers,
    },
  });
}
