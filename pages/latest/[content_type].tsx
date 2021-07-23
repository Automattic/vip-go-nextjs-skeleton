import { GetStaticProps, GetStaticPaths } from 'next';
import Link from 'next/link';
import Page from '@/components/Page/Page';
import getApolloClient from '@/graphql/apollo';
import {
	AllContentTypesDocument,
	AllContentTypesQuery,
	ContentNodeFieldsFragment,
	ContentTypeByNameDocument,
	ContentTypeByNameQuery,
} from '@/graphql/generated';

type Props = {
	loading: boolean,
	posts: ContentNodeFieldsFragment[],
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
							<Link href={post.link}>{post.title}</Link>
						</li>
					) )
				}
			</ul>
		</Page>
	);
}

type ContextParams = {
	content_type: string,
}

export const getStaticProps: GetStaticProps<Props, ContextParams> = async ( context ) => {
	const queryOptions = {
		query: ContentTypeByNameDocument,
		variables: {
			name: context.params.content_type,
		},
	};

	const { data, error, loading } = await getApolloClient( context ).query<ContentTypeByNameQuery>( queryOptions );

	const posts = data.contentType?.contentNodes?.nodes || [];
	const title = data.contentType?.description;

	// SEO: Resource not found pages must send a 404 response code.
	if ( error || ! loading && ! posts.length ) {
		return {
			notFound: true,
		};
	}

	return {
		props: {
			loading,
			posts,
			title,
		},
	};
}

export const getStaticPaths: GetStaticPaths = async ( context ) => {
	const queryOptions = {
		query: AllContentTypesDocument,
	};

	const { data } = await getApolloClient( context ).query<AllContentTypesQuery>( queryOptions );

	const paths = data.contentTypes.nodes
		.map( ( { name } ) => ( {
			params: {
				content_type: name,
			},
		} ) );

	return {
		fallback: 'blocking',
		paths,
	};
}
