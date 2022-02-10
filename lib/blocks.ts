import { ReactNode } from 'react';
import { ContentBlockAttribute } from '@/graphql/generated';
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

export {
	mapAttributesToProps,
	mapBlockNamesToComponents,
};
