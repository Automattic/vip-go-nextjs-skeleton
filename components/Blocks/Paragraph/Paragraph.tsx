import { ContentBlock } from '@/graphql/generated';

type Props = {
	block: ContentBlock,
};

export default function Paragraph ( { block: { innerHTML } } : Props ) {
	return <p dangerouslySetInnerHTML={ { __html: innerHTML } } />;
}
