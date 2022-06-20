import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import { randomUUID } from 'crypto'

enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

export type LogContext = {
	[ key: string ]: string | number,
};

/**
 * Generate a new RequestContext that contains the path name that's been requested
 * along with the requestID that's added onto the request by the Automattic infrastructure.
 *
 * In the event that no requestID is found, such as during local development, a UUID is
 * generated instead in the form of local-UUID. A new one will be generated each time
 * this method is called.
 *
 * This is scoped to a request, and is meant for populating the requestContext for server side
 * requests to non-static resources.
 */
export function generateRequestContext( serverSideContext?: GetServerSidePropsContext |
GetStaticPropsContext ) {
	let requestContext: LogContext = { };

	if (( 'undefined' === typeof window ) && (( serverSideContext as GetServerSidePropsContext ).req !== undefined )) {
		const { req } = serverSideContext as GetServerSidePropsContext;

		const sourceId = req.headers[ 'x-request-id' ] || `local-${ randomUUID() }`;
		const pathName = req.url;

		requestContext = {
			sourceId: `${ sourceId }`,
			pathName,
		};

		log( 'RequestContext has been generated', {}, requestContext );
	}

	return requestContext;
}

export function log(
	message: string,
	context: LogContext,
	requestContext: LogContext = {},
	level: LogLevel = LogLevel.INFO
) {
	console.log( JSON.stringify ( {
		context,
		level,
		message,
		requestContext,
		timestamp: Math.round( Date.now() / 1000 ),
	} ) );
}

export function logError(
	err: Error,
	context: LogContext,
	requestContext: LogContext = {},
) {
	const message = err.message || 'An unknown error occurred';

	log( message, context, requestContext, LogLevel.ERROR );
}
