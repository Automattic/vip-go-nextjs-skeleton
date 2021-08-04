import { GetServerSideProps } from 'next';
import Link from 'next/link';
import Page from '@/components/Page/Page';
import getApolloClient from '@/graphql/apollo';
import {
	ContentNodeFieldsFragment,
	ContentTypeByNameDocument,
	ContentTypeByNameQuery,
	ContentTypeByNameQueryVariables,
} from '@/graphql/generated';
import { getInternalLinkPathname } from '@/lib/links';

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
			<ul>
				{
					props.posts.map( post => (
						<li key={post.databaseId}>
							<Link href={getInternalLinkPathname( post.link )}>{post.title}</Link>
						</li>
					) )
				}
			</ul>
			<p>
				{
					props.previousPageLink &&
						<>
							<Link href={props.previousPageLink}>&lt; Previous</Link>
							&nbsp;
						</>
				}
				{
					props.nextPageLink &&
						<Link href={props.nextPageLink}>Next &gt;</Link>
				}
			</p>
		</Page>
	);
}

type ContextParams = {
	content_type: string,
}

export const getServerSideProps: GetServerSideProps<Props, ContextParams> = async ( context ) => {
	const variables: ContentTypeByNameQueryVariables = {
		name: context.params.content_type,
	};

	// Process pagination requests
	if ( context.query.before ) {
		variables.before = `${context.query.before}`;
		variables.last = 10;
	} else {
		variables.after = `${context.query.after}`;
		variables.first = 10;
	}

	const queryOptions = {
		query: ContentTypeByNameDocument,
		variables,
	};

	const { data, error, loading } = await getApolloClient( context ).query<ContentTypeByNameQuery>( queryOptions );

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
	let previousPageLink = null;
	if ( hasNextPage ) {
		nextPageLink = `/latest/${context.params.content_type}?after=${endCursor}`;
	}
	if ( hasPreviousPage ) {
		previousPageLink = `/latest/${context.params.content_type}?before=${startCursor}`;
	}

	// SEO: Resource not found pages must send a 404 response code.
	if ( error || ! loading && ! posts.length ) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			loading,
			nextPageLink,
			posts,
			previousPageLink,
			title,
		},
	};
}
