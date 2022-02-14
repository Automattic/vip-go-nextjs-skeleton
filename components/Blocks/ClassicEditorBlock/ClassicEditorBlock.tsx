import { BlockProps } from '../index';

export default function ClassicEditorBlock ( { block: { innerHTML } }: BlockProps ) {
	return <div dangerouslySetInnerHTML={ { __html: innerHTML } } />;
}
