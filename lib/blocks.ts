import { ContentBlockAttribute } from '@/graphql/generated';

/**
 * Map an array of ContentBlock attributes to an object that can used like props.
 */
export function mapAttributesToProps ( attributes: ContentBlockAttribute[] ): { [ key: string ]: string; } {
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
