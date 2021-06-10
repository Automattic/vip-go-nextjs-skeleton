import Link from 'next/link';
import Page from '@/components/Page/Page';
import contentTypes from '@/graphql/content-types';

export default function Home() {
	return (
		<Page
			title="Home"
		>
			<p>Welcome!</p>
			<h3>Latest content</h3>
			<ul>
				{
					Object.keys( contentTypes ).map( slug => (
						<li key={slug}>
							<Link href={`/latest/${slug}`}>{contentTypes[ slug ].typeName}</Link>
						</li>
					) )
				}
			</ul>
		</Page>
	);
}
