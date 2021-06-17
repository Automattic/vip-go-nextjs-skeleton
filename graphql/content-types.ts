import fragmentMatcher from '@/graphql/generated/fragmentMatcher';

/**
 * @TODO:
 * This should file should be automatically generated by a more sophisticated
 * code generation step that extracts data that we provide via our plugin bundle.
 * For now we will provide a simple mapping between "slugs" and corresponding
 * ContentType properties, with some manual overrides.
 */

const { possibleTypes } = fragmentMatcher;

/**
 * Slugify Pascal/camel-cased string, e.g., MyType to "my-type".
 */
function slugify ( str: string, delimiter: string = '-' ): string {
	return str
		.replace(
			/[A-Z]/g,
			capital => `${delimiter}${capital.toLowerCase()}`
		)
		.replace( new RegExp( `^${delimiter}` ), '' );
}

/**
 * Enumify camel-cased string, e.g., MyType to "MY_TYPE".
 */
function enumify ( str: string ): string {
	const enumType = slugify( str, '_' ).toUpperCase();

	// Annoying inconsistency.
	if ( [ 'PAGES', 'POSTS' ].includes( enumType ) ) {
		return enumType.replace( /S$/, '' );
	}

	return enumType;
}

type ContentTypeDefinition = {
	[ key: string ]: {
		enum: string,
		label: string,
		typeName: string,
	},
};

const contentTypes = possibleTypes.DisplayNode
	.map( ( typeName: string ) => `${typeName}s` )
	.reduce( ( acc: ContentTypeDefinition, typeName: string ): ContentTypeDefinition => ( {
		...acc,
		[ slugify( typeName ) ]: {
			enum: enumify( typeName ),
			label: typeName,
			typeName,
		},
	} ), {} );

export default contentTypes;
