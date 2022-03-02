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
		const { hostname, pathname, protocol, search } = new URL( url );

		// Determine if the link destination should be considered internal.
		if ( [ 'http:', 'https:' ].includes( protocol ) && internalLinkHostnames.includes( hostname ) ) {
			return `${getCorrectPathname( pathname )}${search}`;
		}
	} catch ( err ) { /* continue */ }

	return url;
}

/**
 * If the environment variable NEXT_PUBLIC_WORDPRESS_ENDPOINT is not defined,
 * assume WPGraphQL is using its default endpoint and just peel off /graphql.
 */
export function getPublicEndpoint() {
	const uri = process.env.NEXT_PUBLIC_SERVER_URL;

	// If endpoint is undefined, throw for visibility.
	if ( 'undefined' === typeof uri ) {
		throw new Error( 'Public server endpoint is undefined' );
	}

	return uri;
}
