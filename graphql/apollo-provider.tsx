import { ReactNode } from 'react';
import { ApolloProvider } from '@apollo/client';
import getApolloClient from './apollo';

type Props = {
	children: ReactNode,
};

/**
 * This is a provider that you can *optionally* use if you have a widespread need
 * to load data during the client-side render. It is not in use by default.
 * Wrapping your app (_app.tsx) in this provider will make Apollo available for
 * use in your React components (e.g., useQuery) but will increase the size of
 * your bundle.
 *
 * If you don't have a widespread need for this, stick to getStaticProps and
 * getServerSideProps and enjoy a smaller bundle and more performant site. :)
 *
 * If you need to load data client-side for just a few pages, consider wrapping
 * just those pages. Next.js's code splitting will ensure that your other pages
 * retain a smaller bundle size.
 */
export default function ClientSideApolloProvider( props: Props ) {
	return (
		<ApolloProvider client={getApolloClient()}>
			{props.children}
		</ApolloProvider>
	);
}
