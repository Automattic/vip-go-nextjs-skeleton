type Props = {
	innerHTML: string,
};

export default function Heading ( props: Props ) {
	return <h3 dangerouslySetInnerHTML={ { __html: props.innerHTML } } />;
}
