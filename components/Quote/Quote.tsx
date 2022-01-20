import styles from './Quote.module.css';

type Props = {
	innerHTML: string,
    large?: string,
};

export default function Quote ( props: Props ) {
	return (
		<blockquote
			className={props.large == 'is-style-large' ? styles.largecontainer : styles.container}
			dangerouslySetInnerHTML={ { __html: props.innerHTML } }
		/>
	);
}
