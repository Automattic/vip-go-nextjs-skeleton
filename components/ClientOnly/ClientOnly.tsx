import { ReactNode, useEffect, useState } from 'react';

export default function ClientOnly( props: {
	children: ReactNode,
} ) {
	const [ hasMounted, setHasMounted ] = useState<boolean>( false );

	useEffect( () => {
		setHasMounted( true );
	}, [] );

	if ( ! hasMounted ) {
		return null;
	}

	return props.children;
}
