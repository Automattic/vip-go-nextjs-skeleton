import { ContentBlock } from '@/graphql/generated';
import { mapBlocksToRenderComponents } from '@/lib/blocks';

type Props = {
	blocks: ContentBlock[],
};

export default function PostContent( { blocks }: Props ) {
	// This is a functional component used to render the related component for each block on PostContent
	//
	// If you want to customize some component or create new ones, you can override the props as the
	// example below:
	//
	// const components = mapBlockNamesToComponents({
	//     'core/paragraph': CustomParagraphComponent
	// });
	//
	return (
		<>
			{
				// If you have some custom component to render, you should pass the `components` const as a prop
				// in the map below, as the example:
				//
				// mapBlocksToRenderComponents( { blocks, components } )
				mapBlocksToRenderComponents( { blocks } )
			}
		</>
	);
}
