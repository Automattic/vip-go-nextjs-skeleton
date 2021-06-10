import { GetServerSideProps } from 'next';
import usePostPreview from '@/lib/hooks/usePostPreview';
import ContentNode from '@/pages/[...slug]';

type Props = {
	id: string,
	wpNonce: string,
};

export default function ContentNodePreview( props: Props ) {
	const { loading, post } = usePostPreview( props.id, props.wpNonce );

	if ( ! loading && ! post ) {
		return <p>You do not have permission to preview this post. Are you logged in to WordPress?</p>;
	}

	return (
		<ContentNode
			loading={loading}
			post={post}
		/>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async ( { query } ) => {
	return {
		props: {
			id: `${query.id}`,
			wpNonce: `${query.wp_nonce}`,
		},
	};
}
