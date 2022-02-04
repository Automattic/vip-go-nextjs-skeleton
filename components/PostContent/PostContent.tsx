import ClassicEditorBlock from '@/components/ClassicEditorBlock/ClassicEditorBlock';
import Heading from '@/components/Heading/Heading';
import Paragraph from '@/components/Paragraph/Paragraph';
import Quote from '@/components/Quote/Quote';
import List from '@/components/List/List';
import Image from '@/components/Image/Image';
import UnsupportedBlock from '@/components/UnsupportedBlock/UnsupportedBlock';
import { ContentBlock } from '@/graphql/generated';
import { mapAttributesToProps } from '@/lib/blocks';

export default function PostContent( props: {
	blocks: ContentBlock[],
} ) {
	return (
		<>
			{
				props.blocks.map( ( block, i ) => {
					const blockProps = mapAttributesToProps( block.attributes || [] );
					const defaultProps = { key: `block-${i}` };

					switch ( block.name ) {
						case 'core/image':
							return (
								<Image
									alt={blockProps.alt}
									src={blockProps.src}
									{...blockProps}
									{...defaultProps}
								/>
							);

						case 'core/classic-editor':
							return (
								<ClassicEditorBlock
									innerHTML={block.innerHTML}
									{...defaultProps}
								/>
							);

						case 'core/heading':
							return (
								<Heading
									innerHTML={block.innerHTML}
									{...defaultProps}
								/>
							);

						case 'core/paragraph':
							return (
								<Paragraph
									innerHTML={block.innerHTML}
									{...defaultProps}
								/>
							);

						case 'core/quote':
							return (
								<Quote
									{...defaultProps}
									className={blockProps.className || undefined}
									innerHTML={block.innerHTML}
								/>
							)

						case 'core/list':
							return (
								<List
									innerHTML={block.innerHTML}
									ordered={'1' === blockProps.ordered}
									reversed={'1' === blockProps.reversed}
									start={blockProps.start ? parseInt( blockProps.start, 10 ) : undefined}
									{...defaultProps}
								/>
							);

						default:
							// In development, highlight unsupported blocks so that they get
							// visibility with developers.
							if ( 'development' === process.env.NODE_ENV ) {
								return (
									<UnsupportedBlock
										block={block}
										{...defaultProps}
									/>
								);
							}

							// In production, ignore unsupported blocks.
							return null;
					}
				} )
			}
		</>
	);
}
