import { BlockProps } from '../index';
import styles from './UnsupportedBlock.module.css';

export default function UnsupportedBlock ( { block: { name, tagName, attributes, innerBlocks, outerHTML } }: BlockProps ) {
	const html = outerHTML;

	return (
		<div className={styles.container}>
			<h4 className={styles.title}><strong>Unsupported block</strong>: <code>{name}</code></h4>
			{
				tagName &&
					<h5>{tagName}</h5>
			}
			{
				html &&
					<blockquote>
						{html}
					</blockquote>
			}
			{
				attributes.length > 0 && (
					<ul>
						{
							attributes.map( ( attr, i ) => (
								<li key={i}><strong>{attr.name}</strong>: {attr.value || 'null'}</li>
							) )
						}
					</ul>
				)
			}
			{
				innerBlocks.length > 0 && (
					<ul>
						{
							innerBlocks.map( ( block, i ) => (
								<li key={i}><strong>{block.name}</strong></li>
							) )
						}
					</ul>
				)
			}
		</div>
	);
}
