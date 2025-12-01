import { ReactNode, useEffect, useState } from 'react';

export default function ClientOnly( props: {
	children: ReactNode,
} ) {
	const [ hasMounted, setHasMounted ] = useState<boolean>( false );

	useEffect( () => {
		// This is a valid use case for client-only rendering
		// eslint-disable-next-line react-hooks/set-state-in-effect
		setHasMounted( true );
	}, [] );

	if ( ! hasMounted ) {
		return null;
	}

	return props.children;
}
