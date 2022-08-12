import { GetServerSideProps } from 'next';
import Page from '@/components/Page/Page';
import PostContent from '@/components/PostContent/PostContent';
import getApolloClient from '@/graphql/apollo';
import {
	ContentNodeBySlugDocument,
	ContentNodeBySlugQuery,
	ContentNodeFieldsFragment,
} from '@/graphql/generated';
import { extractLastTokenFromRoute, getInternalLinkPathname } from '@/lib/links';

export type PostProps = {
	loading: boolean,
	post: ContentNodeFieldsFragment,
};

export default function Post( props: PostProps ) {
	if ( 'MediaItem' === props.post.__typename ) {
		return null;
	}

	return (
		<Page
			loading={props.loading}
			title={props.post.title}
		>
			<PostContent blocks={props.post.contentBlocks.blocks} />
		</Page>
	);
}

export const getServerSideProps: GetServerSideProps<PostProps> = async ( context ) => {
	const queryOptions = {
		query: ContentNodeBySlugDocument,
		variables: {
			slug: extractLastTokenFromRoute( context.query.slug ),
		},
	};

	const { data, loading } = await getApolloClient( context ).query<ContentNodeBySlugQuery>( queryOptions );

	// @TODO Disambiguate multiple slug matches.
	const post = data.contentNodes?.nodes?.[0];

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
