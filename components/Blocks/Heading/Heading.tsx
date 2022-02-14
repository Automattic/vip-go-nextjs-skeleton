import { BlockProps } from '../index';

export default function Heading ( { block: { innerHTML } }: BlockProps ) {
	return <h3 dangerouslySetInnerHTML={ { __html: innerHTML } } />;
}
