import { ContentBlock } from '@/graphql/generated';

type Props = {
	block: ContentBlock,
};

export default function Heading ( { block: { innerHTML } }: Props ) {
	return <h3 dangerouslySetInnerHTML={ { __html: innerHTML } } />;
}
