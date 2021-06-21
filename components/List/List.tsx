type Props = {
	innerHTML: string,
	attributes: [ {
		name: string,
		value: string,
	} ],
};

export default function List ( props: Props ) {
	function getAttribute( name ) {
		return props.attributes.find( a => a.name === name );
	}

	const isOrdered = getAttribute( "ordered" )?.value === "1";
	const isReversed = getAttribute( "reversed" )?.value === "1";
	const startFrom = getAttribute( "start" )?.value;

	const Component = isOrdered ? 'ol' : 'ul';

	return <Component dangerouslySetInnerHTML={ { __html: props.innerHTML } } start={ startFrom } reversed={ isReversed }/>;
}
