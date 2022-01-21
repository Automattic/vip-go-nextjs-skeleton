import styles from './Quote.module.css';

/**
 * This is a styled component.
 *
 * The WordPress block will have content (passed as innerHTML):
 *      <p>Before software can be reusable, it first has to be usable.</p><cite>Ralph Johnson</cite>
 * And a className attribute that is either is-style-default or is-style-large
 *
 * The PostContent.tsx will set the large prop to the className and deliver the innerHTML as is.
 *
 * The Quote component is output as:
 *      <blockquote>
 *          <p>Before software can be reusable, it first has to be usable.</p><cite>Ralph Johnson</cite>
 *      </blockquote>
 *
 * The className varies, and refers to the imported styles in Quote.module.css
 *
 * Quote.module.css contains two different styling options - large or default.
 * The large option results in a defined separation vertically between quote and citation, while the default
 * is much more compact.
 */

type Props = {
	innerHTML: string,
	large?: string,
};

export default function Quote ( props: Props ) {
	return (
		<blockquote
			className={ props.large == 'is-style-large' ? styles.largecontainer : styles.container }
			dangerouslySetInnerHTML={ { __html: props.innerHTML } }
		/>
	);
}
