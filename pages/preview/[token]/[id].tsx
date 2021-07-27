import { GetServerSideProps } from 'next';
import { FetchPolicy } from '@apollo/client';
import getApolloClient from '@/graphql/apollo';
import {
	ContentNodePreviewByIdDocument,
	ContentNodePreviewByIdQuery,
} from '@/graphql/generated';
import Post from '@/pages/[...slug]';

// Mirror Post props.
type PreviewProps = React.ComponentProps<typeof Post>;

// Pass through props to Post component. This ensures that previews have parity
// with published posts.
export default function PostPreview( props: PreviewProps ) {
	return <Post {...props} />;
}

export const getServerSideProps: GetServerSideProps<PreviewProps> = async ( context ) => {
	const queryOptions = {
		context: {
			headers: {
				'X-Preview-Token': context.query.token,
			},
		},
		fetchPolicy: 'no-cache' as FetchPolicy,
		query: ContentNodePreviewByIdDocument,
		variables: {
			id: context.query.id,
		},
	};

	const { data, loading } = await getApolloClient( context ).query<ContentNodePreviewByIdQuery>( queryOptions );

	const post = data.contentNode;

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
