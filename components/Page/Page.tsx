import { ReactNode } from 'react';
import Loading from '@/components/Loading/Loading';
import SiteHeader from '@/components/SiteHeader/SiteHeader';

type Props = {
	children: ReactNode,
	loading?: boolean,
	showHeader?: boolean,
	title: string,
};

export default function Page( props: Props ) {
	const {
		loading = false,
		showHeader = true,
	} = props;

	if ( loading ) {
		return <Loading />;
	}

	return (
		<>
			{
				showHeader &&
					<SiteHeader />
			}
			<main>
				<h2>{props.title}</h2>
				{props.children}
			</main>
		</>
	);
}
