import { getAttribute } from '@/components/helpers';
import { ContentBlockAttribute } from '@/graphql/generated';

type Props = {
	innerHTML: string,
	attributes: ContentBlockAttribute[],
};

export default function List ( props: Props ) {
	const isOrdered = getAttribute( props.attributes, 'ordered' ) === '1';
	const isReversed = getAttribute( props.attributes, 'reversed' ) === '1';
	const startFrom = getAttribute( props.attributes, 'start' );

	const Component = isOrdered ? 'ol' : 'ul';

	return (
		<Component
			dangerouslySetInnerHTML={ { __html: props.innerHTML } }
			reversed={ isReversed }
			start={ startFrom ? parseInt( startFrom, 10 ) : undefined }
		/>
	);
}
