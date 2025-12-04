import { GetServerSideProps } from 'next';
import Page from '@/components/Page/Page';
import PostList from '@/components/PostList/PostList';
import getApolloClient from '@/graphql/apollo';
import {
	ContentNodeFieldsFragment,
	ContentTypeByNameDocument,
	ContentTypeByNameQuery,
	ContentTypeByNameQueryVariables,
} from '@/graphql/generated';

type Props = {
	loading: boolean,
	nextPageLink?: string,
	posts: ContentNodeFieldsFragment[],
	previousPageLink?: string,
	title: string,
};

export default function ContentNodes( props: Props ) {
	return (
		<Page
			loading={props.loading}
			title={props.title}
		>
			<PostList
				nextPageLink={props.nextPageLink}
				posts={props.posts}
				previousPageLink={props.previousPageLink}
			/>
		</Page>
	);
}

type ContextParams = {
	content_type: string,
}

export const getServerSideProps: GetServerSideProps<Props, ContextParams> = async ( context ) => {
	const queryParams = { ...context.query };
	const variables: ContentTypeByNameQueryVariables = {
		name: context.params.content_type,
	};

	// Process pagination requests
	if ( context.query.before ) {
		variables.before = `${ queryParams.before }`;
		variables.last = 10;
	} else {
		variables.after = `${ queryParams.after }`;
		variables.first = 10;
	}

	const queryOptions = {
		query: ContentTypeByNameDocument,
		variables,
	};

	const { data, error } = await getApolloClient( context ).query<ContentTypeByNameQuery>( queryOptions );

	const posts = data.contentType?.contentNodes?.nodes || [];
	const title = data.contentType?.description;

	// Extract pagination information and build pagination links.
	const {
		endCursor,
		hasNextPage,
		hasPreviousPage,
		startCursor,
	} = data.contentType?.contentNodes?.pageInfo || {};

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

	// SEO: Resource not found pages must send a 404 response code.
	if ( error || ! posts.length ) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			loading: false,
			nextPageLink,
			posts,
			previousPageLink,
			title,
		},
	};
}
