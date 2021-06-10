import Page from '@/components/Page/Page';
import PostContent from '@/components/PostContent/PostContent';
import { getServerSideContentNodeProps, ContentNodeProps } from '@/graphql/data';

export default function ContentNode( props: ContentNodeProps ) {
	// Type narrowing: Redundant since we do the same check in getServerSideProps,
	// but necessary to convince TypeScript that we haven't hit one of the types
	// in the ContentNode union that doesn't have title or blocks.
	//
	// We should probably create our own union of only types that have content
	// fields (i.e., exclude MediaItem, etc.).
	if ( 'contentBlocks' in props.post ) {
		return (
			<Page
				loading={props.loading}
				title={props.post.title}
			>
				<PostContent blocks={props.post.contentBlocks.blocks} />
			</Page>
		);
	}

	return null;
}

export const getServerSideProps = getServerSideContentNodeProps;
