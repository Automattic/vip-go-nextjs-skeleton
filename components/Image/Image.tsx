import { ComponentProps } from 'react';
import NextImage, { ImageLoader } from 'next/image';
import VipConfig from '../../vip.config';

/**
 * This component wraps Next's image component to provide an image loader. An
 * image loader allows us to add query parameters for VIP's image processor.
 *
 * https://nextjs.org/docs/api-reference/next/image#loader
 * https://docs.wpvip.com/technical-references/vip-go-files-system/image-transformation/
 */

type Props = {
	src: string,
	srcset?: string,
	originalWidth?: number,
	originalHeight?: number,
} & ComponentProps<typeof NextImage>;

const loader: ImageLoader = ( { quality, src, width } ) => {
	if ( src.includes( '/wp-content/uploads' ) ) {
		return `${src}?w=${width}&q=${quality || 75 }`;
	}

	return src;
}

export default function Image ( props: Props ) {
	const imageProps = {
		...props,
		srcSet: props.srcset || undefined,
		src: props.src,
		width: props.width || props.originalWidth,
		height: props.height || props.originalHeight,
		layout: props.width ? 'fixed' as any : 'responsive' as any,
	};

	if ( VipConfig.images.useHtmlTag && imageProps.srcSet ) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img alt={imageProps.alt} {...imageProps} />
		);
	}

	return (
		<NextImage loader={loader} {...imageProps} />
	);
}
