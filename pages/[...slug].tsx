import Page from '@/components/Page/Page';
import PostContent from '@/components/PostContent/PostContent';
import { getServerSideDisplayNodeProps, DisplayNodeProps } from '@/graphql/data';

export default function Post( props: DisplayNodeProps ) {
	return (
		<Page
			loading={props.loading}
			title={props.post.title}
		>
			<PostContent blocks={props.post.contentBlocks.blocks} />
		</Page>
	);
}

export const getServerSideProps = getServerSideDisplayNodeProps;
