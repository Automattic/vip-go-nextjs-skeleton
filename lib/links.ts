import config from '../next.config';
import { links } from '../vip.config';

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
 * Get the correct pathname that respects Next.js config.
 */
function getCorrectPathname ( pathname: string ): string {
	// Respect config for `trailingSlash` to avoid infinite redirect loops.
	// Account for `basePath` to avoid broken links.
	const pathnameRespectingConfig = removeBasePath( pathname.replace( /\/+$/, '' ) )
	if ( config.trailingSlash ) {
		return `${pathnameRespectingConfig}/`;
	}

	return pathnameRespectingConfig;
}

/**
 * Get the hostname of a URL.
 */
export function getHostname ( url: string ): string {
	try {
		const { hostname } = new URL( url );

		return hostname;
	} catch ( err ) { /* continue */ }

	return url;
}

export function getInternalLinkPathname ( url: string ): string {
	try {
		const { hostname, pathname, protocol, search, searchParams } = new URL( url );

		// Determine if the link destination should be considered internal. If so,
		// return the relative path to this Next.js site.
		if ( [ 'http:', 'https:' ].includes( protocol ) && links.isInternalLink( hostname, pathname ) ) {
			// URL formatted in query string with ID parameter (e.g. ?p=1 or ?page_id=2)
			if ( searchParams ) {
				// @TODO Handle ID parameters. Some options:
				// 1. Make a fully dynamic route like /p/1 or /page_id/2
				// 2. Keep the ID parameter in the URL, and direct to a page used for handling query vars, e.g. /query?p=1
				// 3. Detect if the parameter looks like an ID, and load /id/<parameter value>, e.g. /id/1
				return `${getCorrectPathname( pathname )}${search}`;
			} else {
				return `${getCorrectPathname( pathname )}${search}`;
			}
		}
	} catch ( err ) { /* continue */ }

	return url;
}
