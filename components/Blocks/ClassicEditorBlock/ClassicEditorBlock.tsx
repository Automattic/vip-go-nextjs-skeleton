import { ContentBlock } from '@/graphql/generated';

type Props = {
	block: ContentBlock,
};

export default function ClassicEditorBlock ( { block: { innerHTML } } : Props ) {
	return <div dangerouslySetInnerHTML={ { __html: innerHTML } } />;
}
