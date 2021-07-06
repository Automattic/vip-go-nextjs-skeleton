import {ContentBlockAttribute} from "@/graphql/generated";

/**
 * Look for an attribute by name in a list of attributes
 */
export function getAttribute( attributes: ContentBlockAttribute[], name: String ): ContentBlockAttribute {
	return attributes.find( attribute => attribute.name === name );
}
