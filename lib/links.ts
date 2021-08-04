import { internalLinkHostnames } from '@/lib/config';
import config from '../next.config';

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

/**
 * Get the pathname of a URL, respecting Next.js config.
 */
function getPathname ( pathname: string ): string {
	// Respect config for `trailingSlash` to avoid infinite redirect loops.
	// Account for `basePath` to avoid broken links.
	const pathnameRespectingConfig = removeBasePath( pathname.replace( /\/+$/, '' ) )
	if ( config.trailingSlash ) {
		return `${pathnameRespectingConfig}/`;
	}

	return pathnameRespectingConfig;
}

export function getInternalLinkPathname ( url: string ): string {
	try {
		const { hostname, pathname, protocol, search } = new URL( url );

		// Determine if the link destination should be considered internal.
		if ( [ 'http:', 'https:' ].includes( protocol ) && internalLinkHostnames.includes( hostname ) ) {
			return `${getPathname( pathname )}${search}`;
		}
	} catch ( err ) {}

	return url;
}
