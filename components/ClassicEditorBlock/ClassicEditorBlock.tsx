type Props = {
	innerHTML: string,
};

export default function ClassicEditorBlock ( props: Props ) {
	return <div dangerouslySetInnerHTML={ { __html: props.innerHTML } } />;
}
