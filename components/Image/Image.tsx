import { ComponentProps } from 'react';
import NextImage, { ImageLoader, ImageLoaderProps } from 'next/image';
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

function wpImageLoader ( { quality, src, width }: ImageLoaderProps ): string {
	return `${src}?w=${width}&q=${quality || 75 }`;
}

export default function Image ( props: Props ) {
	const imageProps = {
		...props,
		srcSet: props.srcset || undefined,
		src: props.src,
		alt: props.alt,
		width: props.width || props.originalWidth,
		height: props.height || props.originalHeight,
		layout: props.layout || (props.width && props.height ? 'fixed' as const : 'intrinsic' as const),
	};

	if ( VipConfig.images.useHtmlTag && imageProps.srcSet ) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img alt={imageProps.alt} {...imageProps} />
		);
	}

	// Only set a loader if it is actually needed. This avoids a Next.js warning:
	// https://nextjs.org/docs/messages/next-image-missing-loader-width
	let loader: ImageLoader;
	if ( props.src.includes( '/wp-content/uploads/' ) ) {
		loader = wpImageLoader;
	}

	return (
		<NextImage loader={loader} {...imageProps} />
	);
}
