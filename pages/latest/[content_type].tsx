import Link from 'next/link';
import Page from '@/components/Page/Page';
import { getServerSideContentNodesProps, ContentNodesProps } from '@/graphql/data';

export default function ContentNodes( props: ContentNodesProps ) {
	return (
		<Page
			loading={props.loading}
			title={`Latest ${props.label}`}
		>
			<ul>
				{
					props.posts.map( post => {
						// Type guard. See comment in `[...slug].tsx`.
						if ( 'contentBlocks' in post ) {
							return (
								<li key={post.databaseId}>
									<Link href={post.link}>{post.title}</Link>
								</li>
							);
						}

						return null;
					} )
				}
			</ul>
		</Page>
	);
}

export const getServerSideProps = getServerSideContentNodesProps;
