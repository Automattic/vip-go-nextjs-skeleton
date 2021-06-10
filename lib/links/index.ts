import { internalLinkHostnames } from '@/lib/config';
import config from '../../next.config';

const basePathRemover = new RegExp( `^${config.basePath}/*` );

function removeBasePath( pathname: string ): string {
	if ( config.basePath ) {
		return pathname.replace( basePathRemover, '/' );
	}

	return pathname;
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
