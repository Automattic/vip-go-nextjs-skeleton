import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, concat } from '@apollo/client';
import fragmentMatcher from '@/graphql/generated/fragmentMatcher';
import fetch from 'isomorphic-fetch';

let clientSideApolloClient: ApolloClient<any>;

const isServerSide = 'undefined' === typeof window;
const uri = process.env.NEXT_PUBLIC_GRAPHQL_ENDPOINT;

const { possibleTypes } = fragmentMatcher;

const link = concat(
	new ApolloLink( ( operation, forward ) => {
		// Some logging to help debug.
		if ( isServerSide ) {
			console.log( operation );
		}

		operation.setContext( ( { headers = {} } ) => ( {
			headers: {
				...headers,
				// Here is where we would set custom request headers. If client-side,
				// must be allowed by CORS policy
			}
		} ) );

		return forward( operation );
	} ),
	new HttpLink( {
		fetch: function ( input, init ) {
			return fetch( input, init );
		},
		uri,
	} ),
);

/**
 * Server-side / static, Apollo client should be recreated for each request so
 * that the in-memory cache is not shared across requests.
 *
 * Client-side, Apollo client should be reused to benefit from the cache.
 *
 * This function detects whether it is being called in a server or browser
 * environment and returns a new instance or a shared instance saved in-memory.
 *
 * tl;dr: Just call this function whenever you need an Apollo client. :)
 */
export default function getApolloClient () {
	// If endpoint is undefined, throw for visibility.
	if ( 'undefined' === typeof uri ) {
		throw new Error( 'GraphQL endpoint is undefined' );
	}

	// Server-side / static: Return a new instance every time.
	if ( isServerSide ) {
		return new ApolloClient( {
			cache: new InMemoryCache( { possibleTypes } ),
			link,
			ssrMode: true,
		} );
	}

	// Client-side: Create and store a single instance if it doesn't yet exist.
	if ( 'undefined' === typeof clientSideApolloClient ) {
		clientSideApolloClient =  new ApolloClient( {
			cache: new InMemoryCache( { possibleTypes } ),
			link,
		} );
	}

	return clientSideApolloClient;
}
