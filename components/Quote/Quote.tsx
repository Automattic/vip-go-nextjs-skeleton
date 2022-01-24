import styles from './Quote.module.css';

/**
 * This is a styled component, for the [Gutenberg Quote Block](https://gogutenberg.com/blocks/quote/).
 *
 * The WordPress block will have content (passed as innerHTML):
 *      <p>Before software can be reusable, it first has to be usable.</p><cite>Ralph Johnson</cite>
 * And a className attribute that is (by default) either is-style-default or is-style-large
 *
 * The PostContent.tsx case for Quote will ensure both innerHTML and className are part of the props
 *
 * The Quote component is output as:
 *      <blockquote>
 *          <p>Before software can be reusable, it first has to be usable.</p><cite>Ralph Johnson</cite>
 *      </blockquote>
 *
 * The className varies, but should start with is-style-, so we just grab the rest and use a switch statement
 * to assign the appropriate override style that is imported from Quote.module.css. The .container style is
 * our default styling and catch-all that should work even if there's no className.
 *
 * Quote.module.css contains two different styling options - base/default (the .container class) and large (the .large class).
 * 
 * The large option results in a defined separation vertically between quote and citation, while the default
 * is much more compact.
 * 
 * Since the style can be extended/customized within WordPress, the code here assumes there may be 
 * other classNames -- but only supports the two current options. If additional classNames can be selected
 * from the WP admin UI, then declare the related styles in the CSS file and add a case statement for that style.
 */

type Props = {
	innerHTML: string,
	large?: string,
};

export default function Quote ( props: Props ) {
	// assign 'large', 'default', or something else to classVersion (the Quote style)
	const classVersion = props.className ? props.className.substring(9) : 'default';
	let style = styles.container;

	switch ( classVersion ) {
		case 'large': 
			style +=  ' ' + styles.large;
			break;
		// Add additional styles here
		case 'default':
		default:
			// no additional class
	}

	return (
		<blockquote
			className={ style }
			dangerouslySetInnerHTML={ { __html: props.innerHTML } }
		/>
	);
}
