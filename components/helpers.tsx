/**
 * Look for an attribute by name in a list of attributes
 */

export function getAttribute( attributes: Array[], name: String ): Object {
	return attributes.find( attribute => attribute.name === name );
}
