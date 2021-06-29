import Page from '@/components/Page/Page';
import { getStaticContentTypeProps, ContentTypesProps } from '@/graphql/data';

export default function ContentTypes( props: ContentTypesProps ) {
	return (
		<Page
			title="Content types"
		>
			<ul>
				{
					props.contentTypes.map( contentType => (
						<li key={contentType.id}>
							<code>{contentType.graphqlSingleName}</code>
							{
								contentType.connectedTaxonomies?.nodes?.length > 0 &&
									<ul>
										{
											contentType.connectedTaxonomies.nodes.map( ( taxonomy, i ) => (
												<li key={i}>{taxonomy.graphqlSingleName}</li>
											) )
										}
									</ul>
							}
						</li>
					) )
				}
			</ul>
		</Page>
	);
}

export const getStaticProps = getStaticContentTypeProps;
