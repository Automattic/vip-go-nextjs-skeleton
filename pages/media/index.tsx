import { GetServerSideProps } from 'next';
import Image from '@/components/Image/Image';
import Page from '@/components/Page/Page';
import getApolloClient from '@/graphql/apollo';
import {
	AllMediaItemsDocument,
	AllMediaItemsQuery,
	MediaItemFieldsFragment,
} from '@/graphql/generated';
import styles from './index.module.css';

type Props = {
	loading: boolean,
	mediaItems: MediaItemFieldsFragment[],
};

export default function Media( props: Props ) {
	return (
		<Page
			loading={props.loading}
			title="Media Gallery"
		>
			<div className={styles.container}>
				{
					props.mediaItems.map( mediaItem => {
						const {
							altText = '',
							id,
							sourceUrl,
						} = mediaItem;

						// Each image is displayed in a fixed-height box of 100px. If the
						// actual height of the image is less than 100px, then use
						return (
							<a
								className={styles['image-link']}
								href={sourceUrl}
								key={id}
								rel="noreferrer"
								target="_blank"
							>
								<Image
									alt={altText}
									className={styles.image}
									fill={true}
									src={sourceUrl}
								/>
							</a>
						);
					} )
				}
			</div>
		</Page>
	);
}

export const getServerSideProps: GetServerSideProps<Props> = async ( context ) => {
	const queryOptions = {
		query: AllMediaItemsDocument,
	};

	const { data, loading } = await getApolloClient( context ).query<AllMediaItemsQuery>( queryOptions );

	const mediaItems = data.mediaItems?.nodes;

	return {
		props: {
			loading,
			mediaItems,
		},
	};
}
