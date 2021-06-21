import { getServerSideDisplayNodePreviewProps, DisplayNodeProps } from '@/graphql/data';
import DisplayNode from '@/pages/[...slug]';

export default function PostPreview( props: DisplayNodeProps ) {
	return <DisplayNode {...props} />;
}

export const getServerSideProps = getServerSideDisplayNodePreviewProps;
