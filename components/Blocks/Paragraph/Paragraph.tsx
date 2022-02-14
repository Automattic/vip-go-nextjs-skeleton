import { BlockProps } from '../index';

export default function Paragraph ( { block: { innerHTML } }: BlockProps ) {
	return <p dangerouslySetInnerHTML={ { __html: innerHTML } } />;
}
