import { createElement } from 'react';
import { ContentBlock } from '@/graphql/generated';
import { mapAttributesToProps } from '@/lib/blocks';
import defaultBlockMap from '@/components/Blocks/index';

type BlocksToComponentsProps = typeof defaultBlockMap;

type Props = {
	blocks: ContentBlock[],
	blockMapOverrides?: BlocksToComponentsProps,
};

export default function PostContent( { blocks, blockMapOverrides = {  } } : Props ) {
	// This is a functional component used to render the related component for each block on PostContent
	//
	// If you want to customize some component or create new ones, you can provide the blockMapOverrides prop to this component
	// with a mapping when you're rendering some page on next.js structure.
	//
	const blockMap : BlocksToComponentsProps = {
		...defaultBlockMap,
		...blockMapOverrides,
	};

	return (
		<>
			{
				blocks.map( ( block, i ) => {
					const attributesProps = mapAttributesToProps( block.attributes || [] );
					const defaultProps = { key: `block-${i}`, block };
					const Component = blockMap[ block.name ];

					if ( Component ) {
						return createElement(
							Component as string,
							{ ...defaultProps, ...attributesProps },
						);

					// In development, highlight unsupported blocks so that they get
					// visibility with developers.
					} else if ( 'development' === process.env.NODE_ENV ) {
						return createElement(
							blockMap[ 'unsupported' ] as string,
							defaultProps,
						);
					}

					// In production, ignore unsupported blocks.
					return null;
				})
			}
		</>
	);
}
