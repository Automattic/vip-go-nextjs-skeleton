import { ApolloClient, InMemoryCache } from '@apollo/client';
import { GetServerSidePropsContext, GetStaticPropsContext } from 'next';
import fragmentMatcher from '@/graphql/generated/fragmentMatcher';
import getApolloLink from './apollo-link';

let clientSideApolloClient: ApolloClient<unknown>;

const isServerSide = 'undefined' === typeof window;

const { possibleTypes } = fragmentMatcher;

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
 *
 * If you are using this function inside `getServerSideProps`, pass the provided
 * context as the first parameter for additional detail in your logging. (Since
 * `getStaticProps` is run at build time, its context is not useful.)
 */
export default function getApolloClient ( serverSideContext?: GetServerSidePropsContext | GetStaticPropsContext ) {
	// Server-side / static: Return a new instance every time.
	if ( isServerSide ) {
		// @ts-expect-error: Express locals are not defined on Next.js request.
		let { requestContext } = serverSideContext?.res?.locals || {};

		// @ts-expect-error: res may not be defined
		const sourceId = serverSideContext?.res?.getHeader('x-source-id');
		// @ts-expect-error: res may not be defined
		const pathName = serverSideContext?.res?.getHeader('x-request-path');

		// Add the requestID for the original API/Page request to each request's underlying context
		if (sourceId) {
			requestContext = {
				...requestContext,
				sourceId
			};
		}

		// Add the path name for the original API/Page request to each request's underlying context
		if (pathName) {
			requestContext = {
				...requestContext,
				pathName
			};
		}

		return new ApolloClient( {
			cache: new InMemoryCache( { possibleTypes } ),
			link: getApolloLink( requestContext ),
			ssrMode: true,
		} );
	}

	// Client-side: Create and store a single instance if it doesn't yet exist.
	if ( 'undefined' === typeof clientSideApolloClient ) {
		clientSideApolloClient =  new ApolloClient( {
			cache: new InMemoryCache( { possibleTypes } ),
			link: getApolloLink(),
		} );
	}

	return clientSideApolloClient;
}
