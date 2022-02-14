import { BlockProps } from '../index';
import Image from '@/components/Image/Image';

type Props = BlockProps & {
	src: string,
	alt: string,
};

export default function ImageBlock ( props : Props ) {
	return <Image {...props} alt={props.alt} />
}
