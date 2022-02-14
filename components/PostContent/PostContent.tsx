import { ContentBlock } from '@/graphql/generated';
import { mapAttributesToProps } from '@/lib/blocks';
import defaultBlockMap, { PostContentBlockMap } from '@/components/Blocks';
import UnsupportedBlock from '@/components/Blocks/UnsupportedBlock/UnsupportedBlock';

type Props = {
	blocks: ContentBlock[],
	blockMapOverrides?: PostContentBlockMap,
};

export default function PostContent( { blocks, blockMapOverrides = {} } : Props ) {
	// This is a functional component used to render the related component for each block on PostContent
	//
	// If you want to customize some component or create new ones, you can provide the blockMapOverrides prop to this component
	// with a mapping when you're rendering some page on next.js structure.
	//
	const blockMap: PostContentBlockMap = {
		...defaultBlockMap,
		...blockMapOverrides,
	};

	return (
		<>
			{
				blocks.map( ( block, i ) => {
					const attributesProps = mapAttributesToProps( block.attributes || [] );
					const defaultProps = { key: `block-${i}`, block };
					const Block = blockMap[ block.name ];

					if ( Block ) {
						return <Block {...defaultProps} {...attributesProps } />;
					}

					// In development, highlight unsupported blocks so that they get
					// visibility with developers.
					if ( 'development' === process.env.NODE_ENV ) {
						return <UnsupportedBlock {...defaultProps} />;
					}

					// In production, ignore unsupported blocks.
					return null;
				})
			}
		</>
	);
}
