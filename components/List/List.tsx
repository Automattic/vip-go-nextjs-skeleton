import { getAttribute } from '@/components/helpers';
import { ContentBlockAttribute } from '@/graphql/generated';

type Props = {
	innerHTML: string,
	attributes: ContentBlockAttribute[],
};

export default function List ( props: Props ) {
	const isOrdered = getAttribute( props.attributes, "ordered" )?.value === "1";
	const isReversed = getAttribute( props.attributes, "reversed" )?.value === "1";
	const startFrom = getAttribute( props.attributes, "start" )?.value;

	const Component = isOrdered ? 'ol' : 'ul';

	return <Component dangerouslySetInnerHTML={ { __html: props.innerHTML } } start={ startFrom } reversed={ isReversed }/>;
}
