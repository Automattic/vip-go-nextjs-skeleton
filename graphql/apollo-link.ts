import { ApolloLink, HttpLink } from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import {
	CombinedGraphQLErrors,
	CombinedProtocolErrors,
} from "@apollo/client/errors";
import { log, logError, LogContext } from '@/lib/log';
import { map } from 'rxjs';
const uri = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

export default function getApolloLink ( requestContext: LogContext = {} ) {
	// If endpoint is undefined, throw for visibility.
	if ( 'undefined' === typeof uri ) {
		throw new Error( 'GraphQL endpoint is undefined' );
	}

	return ApolloLink.from( [
		// Error link to log GraphQL errors.
		new ErrorLink( ( { error } ) => {
			if ( CombinedGraphQLErrors.is(error)) {
				error.errors.forEach( err => {
					const { locations, path } = err;
					const context = {
						locations: JSON.stringify( locations ),
						path: JSON.stringify( path ),
					};

					logError( err, context, requestContext );
				} )
			} else if ( CombinedProtocolErrors.is(error)) {
				logError( error, {}, requestContext );
			}
		} ),

		// Custom ApolloLink to log successful queries for debugging.
		new ApolloLink( ( operation, forward ) => {
			const { operationName, setContext, variables } = operation;

			const debug = {
				operationName,
				variables: JSON.stringify( variables ),
			};

			const startTime = Date.now();

			setContext( ( { headers = {} } ) => ( {
				headers: {
					...headers,
					// Here is where you can set custom request headers for your GraphQL
					// requests. If the request is client-side, it must be allowed by the
					// CORS policy in WPGraphQL.
				},
			} ) );

			return forward( operation )
				.pipe(
					map( data => {
						const response = operation.getContext().response;
						const context = {
							...debug,
							cacheStatus: response?.headers?.get( 'x-cache' ),
							cacheAge: response?.headers?.get( 'age' ),
							payloadSize: response?.body?.bytesWritten,
							requestDurationInMs: Date.now() - startTime,
						};

						log( 'GraphQL request', context, requestContext );

						return data;
					} ) );
		} ),

		// Standard HttpLink to connect to GraphQL.
		new HttpLink( { uri } ),
	] );
}
