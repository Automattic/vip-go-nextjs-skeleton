import { ContentBlock } from '@/graphql/generated';
import styles from './UnsupportedBlock.module.css';

type Props = {
	block: ContentBlock,
};

export default function UnsupportedBlock ( props: Props ) {
	return (
		<div className={styles.container}>
			<h4 className={styles.title}><strong>Unsupported block</strong>: <code>{props.block.name}</code></h4>
			<blockquote>
				{props.block.innerHTML}
			</blockquote>
			{
				props.block.attributes.length > 0 && (
					<ul>
						{
							props.block.attributes.map( ( attr, i ) => (
								<li key={i}><strong>{attr.name}</strong>: {attr.value}</li>
							) )
						}
					</ul>
				)
			}
		</div>
	);
}
