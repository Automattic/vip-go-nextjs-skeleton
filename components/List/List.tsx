type Props = {
	innerHTML: string,
	ordered?: boolean,
	reversed?: boolean,
	start?: number,
};

export default function List ( props: Props ) {
	if ( props.ordered ) {
		return (
			<ol
				dangerouslySetInnerHTML={{ __html: props.innerHTML }}
				reversed={props.reversed}
				start={props.start}
			/>
		);
	}

	return (
		<ul dangerouslySetInnerHTML={{ __html: props.innerHTML }} />
	);
}
