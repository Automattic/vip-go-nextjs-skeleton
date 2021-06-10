import ClassicEditorBlock from '@/components/ClassicEditorBlock/ClassicEditorBlock';
import Heading from '@/components/Heading/Heading';
import Paragraph from '@/components/Paragraph/Paragraph';
import UnsupportedBlock from '@/components/UnsupportedBlock/UnsupportedBlock';
import { ContentBlock } from '@/graphql/generated';

export default function PostContent( props: {
	blocks: ContentBlock[],
} ) {
	return (
		<div>
			{
				props.blocks.map( ( block, i ) => {
					const key = `block-${i}`;

					switch ( block.name ) {
						case 'core/classic-editor':
							return (
								<ClassicEditorBlock
									innerHTML={block.innerHTML}
									key={key}
								/>
							);

						case 'core/heading':
							return (
								<Heading
									innerHTML={block.innerHTML}
									key={key}
								/>
							);

						case 'core/paragraph':
							return (
								<Paragraph
									innerHTML={block.innerHTML}
									key={key}
								/>
							);

						default:
							// In development, highlight unsupported blocks so that they get
							// visibility with developers.
							if ( 'development' === process.env.NODE_ENV ) {
								return (
									<UnsupportedBlock
										block={block}
										key={key}
									/>
								);
							}

							// In production, ignore unsupported blocks.
							return null;
					}
				} )
			}
		</div>
	);
}
