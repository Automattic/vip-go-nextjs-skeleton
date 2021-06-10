type Props = {
	innerHTML: string,
};

export default function Paragraph ( props: Props ) {
	return <p dangerouslySetInnerHTML={ { __html: props.innerHTML } } />;
}
