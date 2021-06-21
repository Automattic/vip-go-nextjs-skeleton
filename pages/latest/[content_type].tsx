import Link from 'next/link';
import Page from '@/components/Page/Page';
import { getServerSideDisplayNodesProps, DisplayNodesProps } from '@/graphql/data';

export default function DisplayNodes( props: DisplayNodesProps ) {
	return (
		<Page
			loading={props.loading}
			title={`Latest ${props.label}`}
		>
			<ul>
				{
					props.posts.map( post => (
						<li key={post.databaseId}>
							<Link href={post.link}>{post.title}</Link>
						</li>
					) )
				}
			</ul>
		</Page>
	);
}

export const getServerSideProps = getServerSideDisplayNodesProps;
