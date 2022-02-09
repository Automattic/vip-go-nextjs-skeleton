import { ContentBlock } from '@/graphql/generated';
import { mapBlocksToRenderComponents } from '@/lib/blocks';
import { ReactNode } from 'react';

type Props = {
	blocks: ContentBlock[],
	blockMapOverrides?: Record<string, ReactNode>,
};

export default function PostContent( { blocks, blockMapOverrides = {  } } : Props ) {
	// This is a functional component used to render the related component for each block on PostContent
	//
	// If you want to customize some component or create new ones, you can provide the blockMapOverrides prop with a mapping when you're
	// rendering some page on next.js structure.
	//
	return (
		<>
			{
				mapBlocksToRenderComponents( { blocks, blockMapOverrides } )
			}
		</>
	);
}
