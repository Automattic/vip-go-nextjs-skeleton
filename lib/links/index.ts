import { internalLinkHostnames } from '@/lib/config';
import config from '../../next.config';

const basePathRemover = new RegExp( `^${config.basePath}/*` );

function removeBasePath( pathname: string ): string {
	if ( config.basePath ) {
		return pathname.replace( basePathRemover, '/' );
	}

	return pathname;
}

/**
 * With dynamic routes, Next.js can pass a string or an array of strings. We
 * want either the singular string or the last item in the array of strings:
 *
 * [ '2021', '06', '10', 'my-chickens-let-me-show-you-them' ]
 *                        ^ we want this
 */
export function extractLastTokenFromRoute( routeQuery: string | string[] ): string {
	if ( ! Array.isArray( routeQuery ) ) {
		return routeQuery;
	}

	return routeQuery.slice().pop();
}

export function getInternalLinkPathname ( url: string ): string | false {
	try {
		const { hostname, pathname } = new URL( url );

		// Determine if the link destination should be considered internal.
		if ( internalLinkHostnames.includes( hostname ) ) {
			// Respect config for `trailingSlash` to avoid infinite redirect loops.
			// Account for `basePath` to avoid broken links.
			const pathnameRespectingConfig = removeBasePath( pathname.replace( /\/+$/, '' ) )
			if ( config.trailingSlash ) {
				return `${pathnameRespectingConfig}/`;
			}

			return pathnameRespectingConfig;
		}
	} catch ( err ) {}

	return false;
}
