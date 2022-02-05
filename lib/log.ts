enum LogLevel {
	DEBUG = 'DEBUG',
	INFO = 'INFO',
	WARN = 'WARN',
	ERROR = 'ERROR',
}

export type LogContext = {
	[ key: string ]: string | number,
};

export function log(
	message: string,
	context: LogContext,
	requestContext: LogContext = {},
	level: LogLevel = LogLevel.INFO
) {
	console.log( {
		context,
		level,
		message,
		requestContext,
		timestamp: Math.round( Date.now() / 1000 ),
	} );
}

export function logError(
	err: Error,
	context: LogContext,
	requestContext: LogContext = {},
) {
	const message = err.message || 'An unknown error occurred';

	log( message, context, requestContext, LogLevel.ERROR );
}
