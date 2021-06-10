import { WatchQueryFetchPolicy } from '@apollo/client';
import { useContentNodePreviewQuery } from '@/graphql/generated';
import getApolloClient from '@/graphql/apollo';

export default function usePostPreview( id: string, wpNonce: string ) {
	const queryOptions = {
		client: getApolloClient(),
		context: {
			headers: {
				'X-WP-Nonce': wpNonce,
			},
		},
		fetchPolicy: 'no-cache' as WatchQueryFetchPolicy,
		ssr: false,
		variables: {
			id,
		},
	};

	const { error, data, loading } = useContentNodePreviewQuery( queryOptions );

	return {
		error,
		loading,
		post: data.contentNode,
	};
}
