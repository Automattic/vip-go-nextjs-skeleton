import { GetServerSideProps, GetStaticProps } from 'next';
import { FetchPolicy } from '@apollo/client';
import {
	DisplayNodePreviewDocument,
	DisplayNodePreviewQuery,
	DisplayNodesDocument,
	DisplayNodesQuery,
	DisplayNodeFieldsFragment,
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

export type DisplayNodeProps = {
	loading: boolean,
	post: DisplayNodeFieldsFragment,
};

export const getServerSideDisplayNodeProps: GetServerSideProps<DisplayNodeProps> = async ( context ) => {
	const queryOptions = {
		query: DisplayNodesDocument,
		variables: {
			slug: extractLastTokenFromRoute( context.query.slug ),
		},
	};

	const { data, loading } = await getApolloClient( context ).query<DisplayNodesQuery>( queryOptions );

	// @TODO Disambiguate multiple slug matches.
	const post = data.displayNodes?.nodes?.[0];

	// SEO: Resource not found pages must send a 404 response code.
	if ( ! loading && ! post ) {
		return {
			notFound: true,
		};
	}

	// SEO: Redirect to canonical URL.
	const internalLinkPathname = getInternalLinkPathname( post.link );
	const resolvedUrlWithoutQueryString = context.resolvedUrl.split( '?' )[0];
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

export const getServerSideDisplayNodePreviewProps: GetServerSideProps<DisplayNodeProps> = async ( context ) => {
	const queryOptions = {
		context: {
			headers: {
				'X-Preview-Token': context.query.token,
			},
		},
		fetchPolicy: 'no-cache' as FetchPolicy,
		query: DisplayNodePreviewDocument,
		variables: {
			id: context.query.id,
		},
	};

	const { data, loading } = await getApolloClient( context ).query<DisplayNodePreviewQuery>( queryOptions );

	const post = data.displayNode;

	// SEO: Resource not found pages must send a 404 response code.
	if ( ! loading && ! post ) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			loading,
			post,
		},
	};
}

export type DisplayNodesProps = {
	label: string,
	loading: boolean,
	posts: DisplayNodeFieldsFragment[],
};

export const getServerSideDisplayNodesProps: GetServerSideProps<DisplayNodesProps> = async ( context ) => {
	const slug = extractLastTokenFromRoute( context.query.content_type );
	const { enum: typeEnum, label } = contentTypeDefinitions[ slug ] || {};

	if ( ! typeEnum ) {
		return {
			notFound: true,
		};
	}

	// Apollo query options.
	const queryOptions = {
		query: DisplayNodesDocument,
		variables: {
			contentTypes: typeEnum,
		},
	};

	const { data, loading } = await getApolloClient( context ).query<DisplayNodesQuery>( queryOptions );

	const posts = data.displayNodes?.nodes || [];

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
	const { loading, data } = await getApolloClient().query<ContentTypesQuery>( {
		query: ContentTypesDocument,
	} );

	return {
		props: {
			contentTypes: data.contentTypes.nodes,
			loading,
		},
	};
}
