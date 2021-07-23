import { GetStaticProps } from 'next';
import Link from 'next/link';
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
	console.log( props.contentTypes );
	return (
		<Page
			title="Home"
		>
			<p>Welcome!</p>
			<h3>Latest content</h3>
			<ul>
				{
					props.contentTypes.map( contentType => (
						<li key={contentType.id}>
							<Link
								href={`/latest/${contentType.name}`}
							>
								{contentType.description}
							</Link>
						</li>
					) )
				}
			</ul>
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
