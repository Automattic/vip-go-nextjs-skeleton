import { internalLinkHostnames } from '@/lib/config';
import config from '../../next.config';

export function getInternalLinkPathname ( url: string ): string | false {
	try {
		const { hostname, pathname } = new URL( url );

		// Determine if the link destination should be considered internal.
		if ( internalLinkHostnames.includes( hostname ) ) {
			// Respect config for `trailingSlash` to avoid infinite redirect loops.
			const pathnameWithoutTrailingSlash = pathname.replace( /\/+$/, '' );
			if ( config.trailingSlash ) {
				return `${pathnameWithoutTrailingSlash}/`;
			}

			return pathnameWithoutTrailingSlash;
		}
	} catch ( err ) {}

	return false;
}
