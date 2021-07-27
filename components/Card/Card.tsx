import { ReactNode } from 'react';
import styles from './Card.module.css';

type Props = {
	children: ReactNode,
};

export default function Card ( props: Props ) {
	return (
		<div className={styles.container}>
			{props.children}
		</div>
	);
}
