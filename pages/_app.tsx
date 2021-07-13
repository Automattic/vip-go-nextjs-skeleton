import useInternalLinkRouting from '@/lib/hooks/useInternalLinkRouting';
import '@/styles/new.css';

export default function App( { Component, pageProps } ) {
	useInternalLinkRouting();

	return <Component {...pageProps} />;
}
