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

export default function Image ( {
		originalWidth,
		originalHeight,
		srcset,
		...props
	}: Props ) {
	const imageProps = {
		srcSet: srcset || undefined,
		src: props.src,
		alt: props.alt,
		width: props.width || originalWidth,
		height: props.height || originalHeight,
		layout: props.width ? 'fixed' as const : 'responsive' as const,
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
