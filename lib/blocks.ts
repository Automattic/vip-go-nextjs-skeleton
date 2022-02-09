import { createElement, ReactNode } from 'react';
import { ContentBlock, ContentBlockAttribute } from '@/graphql/generated';
import {
	ClassicEditorBlock,
	Heading,
	BlockImage,
	List,
	Paragraph,
	Quote,
	Table,
	UnsupportedBlock,
} from '@/components/Blocks/index';

/**
 * Map an array of ContentBlock attributes to an object that can used like props.
 */
function mapAttributesToProps ( attributes: ContentBlockAttribute[] ): { [ key: string ]: string; } {
	return attributes.reduce( ( acc, { name, value } ) => {
		// Drop attributes without a name or value.
		if ( ! name || ! value ) {
			return acc;
		}

		// Values are always strings, so we could cast some "special" strings to
		// their presumed types. For example, we could convert "false" to false,
		// "null" to null, etc.
		//
		// This could cause unexpected issues, so we will leave that exercise for
		// those that find a need for it.

		return Object.assign( acc, { [ name ]: value } );
	}, {} );
}

type BlocksToComponentsProps = Record<string, ReactNode>;

/**
 * Return an object with respected key-values based on Gutenberg Blocks
 * https://gogutenberg.com/blocks/
 */
function mapBlockNamesToComponents ( override?: BlocksToComponentsProps ): Record<string, ReactNode> {
	return {
		'core/classic-editor': ClassicEditorBlock,
		'core/heading': Heading,
		'core/image': BlockImage,
		'core/list': List,
		'core/paragraph': Paragraph,
		'core/quote': Quote,
		'core/table': Table,
		'unsupported': UnsupportedBlock,
		...override,
	}
}

type BlocksToRenderComponentsProps = {
	blocks: ContentBlock[],
	blockMapOverrides?: Record<string, ReactNode>,
};

function mapBlocksToRenderComponents ( { blocks, blockMapOverrides = {  } } : BlocksToRenderComponentsProps ) {
	return (
		blocks.map( ( block, i ) => {
			const attributesProps = mapAttributesToProps( block.attributes || [] );
			const defaultProps = { key: `block-${i}`, block };

			const components = mapBlockNamesToComponents( blockMapOverrides );

			if ( Object.keys( components ).includes( block.name ) ) {
				return createElement(
					components[block.name] as string,
					{ ...defaultProps, ...attributesProps },
				);

			// In development, highlight unsupported blocks so that they get
			// visibility with developers.
			} else if ( 'development' === process.env.NODE_ENV ) {
				return createElement(
					components['unsupported'] as string,
					defaultProps,
				);
			}

			// In production, ignore unsupported blocks.
			return null;
		})
	)
}

export {
	mapAttributesToProps,
	mapBlockNamesToComponents,
	mapBlocksToRenderComponents,
};
