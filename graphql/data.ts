import { GetServerSideProps, GetStaticProps } from 'next';
import {
	ContentNodesDocument,
	ContentNodesQuery,
	ContentNodeViewFragment,
	ContentTypeListFragment,
	ContentTypesDocument,
	ContentTypesQuery,
} from './generated';
import getApolloClient from './apollo';
import contentTypeDefinitions from './content-types';
import { getInternalLinkPathname } from '@/lib/links';

/**
 * Drop-in `getServerSideProps` and `getStaticProps` functions to fetch content.
 */

/**
 * With dynamic routes, Next.js can pass a string or an array of strings. We
 * want either the singular string or the last item in the array of strings:
 *
 * [ '2021', '06', '10', 'my-chickens-let-me-show-you-them' ]
 *                        ^ we want this
 */
function extractLastTokenFromRoute( routeQuery: string | string[] ): string {
	if ( ! Array.isArray( routeQuery ) ) {
		return routeQuery;
	}

	return routeQuery.slice().pop();
}

/**
 * @TODO Ship it
 */
function handleError( err: Error ): void {
	console.error( err );
}

export type ContentNodeProps = {
	loading: boolean,
	post: ContentNodeViewFragment,
};

export const getServerSideContentNodeProps: GetServerSideProps<ContentNodeProps> = async ( { query, resolvedUrl } ) => {
	const queryOptions = {
		query: ContentNodesDocument,
		variables: {
			slug: extractLastTokenFromRoute( query.slug ),
		},
	};

	const { data, error, loading } = await getApolloClient().query<ContentNodesQuery>( queryOptions );

	// @TODO Disambiguate multiple slug matches.
	const post = data.contentNodes?.nodes?.[0];

	if ( error ) {
		handleError( error );
	}

	// SEO: Resource not found pages must send a 404 response code.

	if ( ! loading && ! post ) {
		return {
			notFound: true,
		};
	}

	// SEO: Redirect to canonical URL.
	const internalLinkPathname = getInternalLinkPathname( post.link );
	const resolvedUrlWithoutQueryString = resolvedUrl.split( '?' )[0];
	if ( ! loading && internalLinkPathname !== resolvedUrlWithoutQueryString ) {
		return {
			redirect: {
				destination: internalLinkPathname || post.link,
				permanent: false,
			},
		};
	}

	return {
		props: {
			loading,
			post,
		},
	};
}

export type ContentNodesProps = {
	label: string,
	loading: boolean,
	posts: ContentNodeViewFragment[],
};

export const getServerSideContentNodesProps: GetServerSideProps<ContentNodesProps> = async ( { query } ) => {
	const slug = extractLastTokenFromRoute( query.content_type );
	const { enum: typeEnum, label } = contentTypeDefinitions[ slug ] || {};

	if ( ! typeEnum ) {
		return {
			notFound: true,
		};
	}

	// Apollo query options.
	const queryOptions = {
		query: ContentNodesDocument,
		variables: {
			contentTypes: typeEnum,
		},
	};

	const { data, error, loading } = await getApolloClient().query<ContentNodesQuery>( queryOptions );

	const posts = data.contentNodes?.nodes || [];

	if ( error ) {
		handleError( error );
	}

	// SEO: Resource not found pages must send a 404 response code.
	if ( ! loading && ! posts.length ) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			label,
			loading,
			posts,
		},
	};
}

export type ContentTypesProps = {
	contentTypes: ContentTypeListFragment[],
	loading: boolean,
};

export const getStaticContentTypeProps: GetStaticProps<ContentTypesProps> = async () => {
	const { loading, error, data } = await getApolloClient().query<ContentTypesQuery>( {
		query: ContentTypesDocument,
	} );

	if ( error ) {
		handleError( error );
	}

	return {
		props: {
			contentTypes: data.contentTypes.nodes,
			loading,
		},
	};
}
