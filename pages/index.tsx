import { GetStaticProps } from 'next';
import Link from 'next/link';
import Card from '@/components/Card/Card';
import Page from '@/components/Page/Page';
import getApolloClient from '@/graphql/apollo';
import {
	AllContentTypesDocument,
	AllContentTypesQuery,
	ContentTypeFieldsFragment,
} from '@/graphql/generated';

type Props = {
	contentTypes: ContentTypeFieldsFragment[],
};

export default function Home( props: Props ) {
	return (
		<Page
			title="Welcome 👋"
		>
			<p>This decoupled WordPress site is built with WordPress VIP’s <a href="https://github.com/Automattic/vip-go-nextjs-skeleton">Next.js boilerplate</a> and <a href="https://github.com/Automattic/vip-decoupled-bundle">decoupled plugin bundle</a>. If you’re seeing this page, it means your decoupled site has been successfully deployed. Please take a moment to read through this introduction, which supplements <a href="https://docs.wpvip.com/technical-references/vip-platform/node-js/">our public documentation</a> and the <code>README</code> of this repo.</p>

			<nav>
				<ul>
					<li><a href="#getting-started">Getting started</a></li>
					<li><a href="#your-content">Your content</a></li>
					<li><a href="#previewing">Previewing</a></li>
				</ul>
			</nav>

			<h3 id="getting-started">Getting started</h3>
			<p>This boilerplate provides some basic functionality out-of-the-box, allowing you to <strong>view and preview your content</strong>. Explore the pages linked below and examine the code and GraphQL queries that power them. Feel free to delete this sample code or extend it for your own purposes.</p>
			<Card>
				<h3 id="your-content">Your content</h3>
				<ul>
					{
						props.contentTypes
							.map( contentType => (
								<li key={contentType.name}>
									<Link href={`/latest/${contentType.name}`}>{contentType.name}</Link>
								</li>
							) )
					}
					<li><Link href="/media">media library</Link></li>
				</ul>
			</Card>
			<h3 id="previewing">Previewing</h3>
			<p>Previewing unpublished posts or updates to published posts works out of the box. Simply click the “Preview” button in WordPress and you’ll be redirected to a one-time-use preview link on this decoupled site.</p>
		</Page>
	);
}

export const getStaticProps: GetStaticProps<Props> = async ( context ) => {
	const queryOptions = {
		query: AllContentTypesDocument,
	};

	const { data } = await getApolloClient( context ).query<AllContentTypesQuery>( queryOptions );

	const contentTypes = data.contentTypes.nodes || [];

	return {
		props: {
			contentTypes: contentTypes.filter( contentType => contentType.contentNodes.nodes.length ),
		},
	};
};
