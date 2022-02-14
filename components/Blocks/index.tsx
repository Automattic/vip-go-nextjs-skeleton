import { ComponentType } from 'react';
import { ContentBlock } from '@/graphql/generated';
import ClassicEditorBlock from './ClassicEditorBlock/ClassicEditorBlock';
import Heading from './Heading/Heading';
import ImageBlock from './ImageBlock/ImageBlock';
import List from './List/List';
import Paragraph from './Paragraph/Paragraph';
import Quote from './Quote/Quote';
import Table from './Table/Table';

export interface BlockProps {
	block: ContentBlock,
}

export type PostContentBlockMap = {
	[ key: string ]: ComponentType<BlockProps>;
};

const defaultBlockMap: PostContentBlockMap = {
	'core/classic-editor': ClassicEditorBlock,
	'core/heading': Heading,
	'core/image': ImageBlock,
	'core/list': List,
	'core/paragraph': Paragraph,
	'core/quote': Quote,
	'core/table': Table,
};

export default defaultBlockMap;
