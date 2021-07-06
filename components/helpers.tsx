import { ContentBlockAttribute } from '@/graphql/generated';

/**
 * Look for an attribute value by name in a list of attributes
 */
export function getAttribute( attributes: ContentBlockAttribute[], name: string ): string | undefined {
	return attributes.find( attribute => attribute.name === name )?.value;
}
