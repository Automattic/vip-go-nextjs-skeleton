import { getServerSideContentNodePreviewProps, ContentNodeProps } from '@/graphql/data';
import ContentNode from '@/pages/[...slug]';

export default function ContentNodePreview( props: ContentNodeProps ) {
	return <ContentNode {...props} />;
}

export const getServerSideProps = getServerSideContentNodePreviewProps;
