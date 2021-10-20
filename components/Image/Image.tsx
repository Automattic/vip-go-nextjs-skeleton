import { ComponentProps } from 'react';
import NextImage, { ImageLoader } from 'next/image';

/**
 * This component wraps Next's image component to provide an image loader. An
 * image loader allows us to add query parameters for VIP's image processor.
 *
 * https://nextjs.org/docs/api-reference/next/image#loader
 * https://docs.wpvip.com/technical-references/vip-go-files-system/image-transformation/
 */

type Props = ComponentProps<typeof NextImage>;

const loader: ImageLoader = ( { quality, src, width } ) => {
	if ( src.includes( '/wp-content/uploads' ) ) {
		return `${src}?w=${width}&q=${quality || 75 }`;
	}

	return src;
}

export default function Image ( props: Props ) {
	return (
		<NextImage
			layout="responsive"
			{...props}
			loader={loader}
		/>
	);
}
