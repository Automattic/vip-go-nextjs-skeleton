import { GetServerSideProps } from 'next';
import Page from '@/components/Page/Page';
import PostList from '@/components/PostList/PostList';
import SearchForm from '@/components/SearchForm/SearchForm';
import getApolloClient from '@/graphql/apollo';
import {
	ContentNodeFieldsFragment,
	ContentNodesBySearchTermDocument,
	ContentNodesBySearchTermQuery,
	ContentNodesBySearchTermQueryVariables,
} from '@/graphql/generated';

type Props = {
	loading: boolean,
	nextPageLink?: string,
	posts: ContentNodeFieldsFragment[],
	previousPageLink?: string,
	search: string,
};

export default function Search( props: Props ) {
	return (
		<Page
			loading={props.loading}
			title={`Search results for ${ props.search }`}
		>
			<SearchForm
				path="/search"
				search={props.search}
			/>
			<PostList
				nextPageLink={props.nextPageLink}
				posts={props.posts}
				previousPageLink={props.previousPageLink}
			/>
		</Page>
	);
}

type ContextParams = Record<never, string>;

export const getServerSideProps: GetServerSideProps<Props, ContextParams> = async ( context ) => {
	const queryParams = { ...context.query };

	if ( ! queryParams.s ) {
		// The user has not searched yet.
		return {
			props: {
				loading: false,
				posts: [],
				search: '',
			},
		};
	}

	const search = `${ queryParams.s }`.trim();
	const variables: ContentNodesBySearchTermQueryVariables = {
		search,
	};

	// Process pagination requests
	if ( queryParams.before ) {
		variables.before = `${ queryParams.before }`;
		variables.last = 10;
	} else {
		variables.after = `${ queryParams.after }`;
		variables.first = 10;
	}

	const queryOptions = {
		query: ContentNodesBySearchTermDocument,
		variables,
	};

	const { data, error, loading } = await getApolloClient( context ).query<ContentNodesBySearchTermQuery>( queryOptions );

	if ( error ) {
		throw error;
	}

	const posts = data.contentNodes?.nodes || [];

	// Extract pagination information and build pagination links.
	const {
		endCursor,
		hasNextPage,
		hasPreviousPage,
		startCursor,
	} = data.contentNodes?.pageInfo || {};

	let nextPageLink = null;
	if ( hasNextPage ) {
		const newQueryParams = new URLSearchParams( { ...queryParams, after: endCursor } );
		newQueryParams.delete( 'before' );
		nextPageLink = `?${ newQueryParams.toString() }`;
	}

	let previousPageLink = null;
	if ( hasPreviousPage ) {
		const newQueryParams = new URLSearchParams( { ...queryParams, before: startCursor } );
		newQueryParams.delete( 'after' );
		previousPageLink = `?${ newQueryParams.toString() }`;
	}

	return {
		props: {
			loading,
			nextPageLink,
			posts,
			previousPageLink,
			search,
		},
	};
}
