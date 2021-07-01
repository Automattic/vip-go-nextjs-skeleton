import { getAttribute } from '@/components/helpers';

type Props = {
	innerHTML: string,
	attributes: [ {
		name: string,
		value: string,
	} ],
};

export default function List ( props: Props ) {
	const isOrdered = getAttribute( props.attributes, "ordered" )?.value === "1";
	const isReversed = getAttribute( props.attributes, "reversed" )?.value === "1";
	const startFrom = getAttribute( props.attributes, "start" )?.value;

	const Component = isOrdered ? 'ol' : 'ul';

	return <Component dangerouslySetInnerHTML={ { __html: props.innerHTML } } start={ startFrom } reversed={ isReversed }/>;
}
