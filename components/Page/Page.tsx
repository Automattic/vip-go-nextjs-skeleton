import { ReactNode } from 'react';
import Loading from '@/components/Loading/Loading';
import SiteFooter from '@/components/SiteFooter/SiteFooter';
import SiteHeader from '@/components/SiteHeader/SiteHeader';

/**
 * A page component helps us to enforce consistent UI and SEO best practices
 * across the site.
 *
 * A loading state allows you to avoid rendering the children until the data
 * you need is ready.
 */

type Props = {
	children: ReactNode,
	loading?: boolean,
	title: string,
};

export default function Page( props: Props ) {
	const {
		loading = false,
	} = props;

	if ( loading ) {
		return <Loading />;
	}

	return (
		<>
			<SiteHeader />
			<main>
				<h1>{props.title}</h1>
				{props.children}
			</main>
			<SiteFooter />
		</>
	);
}
