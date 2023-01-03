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
	const { originalHeight, originalWidth, ...imageProps } = props;
	const height = props.height || originalHeight;
	const width = props.width || originalWidth;

	if ( VipConfig.images.useHtmlTag && props.srcset ) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				{...imageProps}
				alt={props.alt}
				srcSet={props.srcset}
			/>
		);
	}

	// Only set a loader if it is actually needed. This avoids a Next.js warning:
	// https://nextjs.org/docs/messages/next-image-missing-loader-width
	let loader: ImageLoader;
	if ( props.src.includes( '/wp-content/uploads/' ) ) {
		loader = wpImageLoader;
	}

	return (
		<NextImage
			loader={loader}
			{...imageProps}
			height={height}
			width={width}
		/>
	);
}
