import { BlockProps } from '../index';
import Image from '@/components/Image/Image';

type Props = BlockProps & {
	alt: string,
	src: string,
};

export default function ImageBlock ( props : Props ) {
	const { block: _omit, ...imageProps } = props;

	return <Image {...imageProps} alt={props.alt} />
}
