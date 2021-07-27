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
					<li><a href="#server-side-rendering">Server-side rendering</a></li>
					<li><a href="#typescript">TypeScript</a></li>
					<li><a href="#code-generation">Code generation</a></li>
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
					<li><Link href="/media">Media library</Link></li>
				</ul>
			</Card>
			<h3 id="previewing">Previewing</h3>
			<p>Previewing unpublished posts or updates to published posts works out of the box. Simply click the “Preview” button in WordPress and you’ll be redirected to a one-time-use preview link on this decoupled site.</p>
			<h3 id="server-side-rendering">Server-side rendering</h3>
			<p>Next.js is optimized to create performant pages that are statically generated at build time (<a href="https://nextjs.org/docs/basic-features/data-fetching#getstaticprops-static-generation"><code>getStaticProps</code></a>) or server-side-rendered at request time (<a href="https://nextjs.org/docs/basic-features/data-fetching#getserversideprops-server-side-rendering"><code>getServerSideProps</code></a>). This results in HTML that is cacheable at the edge and immediately crawlable by search engines.</p>
			<p>This boilerplate uses <a href="https://www.apollographql.com">Apollo</a> to query for data using GraphQL. Many Apollo implementations, including Next.js’s official examples, implement a complex approach that hydrates the data from the server-side render into an in-memory cache, where it can be used for client-side requests. We have intentionally avoided this approach because it introduces a large performance penalty and increases the risk that performance degrades even more over time.</p>
			<p>Before adding client-side data fetching, examine your typical user flows in detail and consider whether it actually benefits your application and its users. Skipping this complicated step simplifies your configuration, decreases page weight, and usually increases overall performance.</p>
			<h3 id="typescript">TypeScript</h3>
			<p>This boilerplate is written in <a href="https://www.typescriptlang.org">TypeScript</a>. Next.js has <a href="https://nextjs.org/docs/basic-features/typescript">built-in support for TypeScript</a> and processes it automatically in both development and production.</p>
			<p>You don’t need to use TypeScript to use this boilerplate: our <code>tsConfig.json</code> is fairly lenient and allows you to write code in either TypeScript or JavaScript.</p>
			<h3 id="code-generation">Code generation</h3>
			<p>When you started this server, our boilerplate first examined the GraphQL queries in <code>./graphql/queries/</code>, introspected your site’s GraphQL schema, and generated TypeScript code that can be used by your Next.js pages. See <code>./pages/[...slug].tsx</code> for an example.</p>
			<p>Having declared types across the entire data chain—your queries, responses, Next.js data loaders, and React components—is incredibly powerful and provides confidence as you build your site. Code generation will continue to run automatically; just put your GraphQL queries in <code>./graphql/queries/</code>. In development, you will need to restart <code>npm run dev</code> to see changes to your queries reflected.</p>
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
			contentTypes,
		},
	};
};
