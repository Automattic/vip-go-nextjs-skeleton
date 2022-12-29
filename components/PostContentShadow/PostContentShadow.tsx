import { useEffect } from 'react';

type Props = {
	content: string,
};

export default function PostContentShadow( { content } : Props ) {
	useEffect( () => {
		import("../WPContentWrapper/WPContentWrapper");
	}, [] );

	return <>
		<code style={{ "margin": "0 0 2rem 0", "display": "block" }}>Shadow content:</code>

		<wp-content-wrapper data-content={content}></wp-content-wrapper>

		<code style={{ "margin": "2rem 0 0 0", "display": "block" }}>End of shadow content</code>
	</>;
}
