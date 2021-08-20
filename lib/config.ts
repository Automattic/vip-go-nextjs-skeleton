import { getHostname, getPublicEndpoint } from '@/lib/links';

export const publicEndpoint = getPublicEndpoint();

/**
 * Hostnames that serve this site, either in production, staging, or in
 * development. This helps our link router determine whether this link should be
 * considered internal (part of this site) or external.
 */
export const internalLinkHostnames = [
	getHostname( publicEndpoint ),
	'localhost',
];
