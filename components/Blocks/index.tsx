import { ReactNode } from 'react';
import ClassicEditorBlock from './ClassicEditorBlock/ClassicEditorBlock';
import Heading from './Heading/Heading';
import ImageBlock from './ImageBlock/ImageBlock';
import List from './List/List';
import Paragraph from './Paragraph/Paragraph';
import Quote from './Quote/Quote';
import Table from './Table/Table';
import UnsupportedBlock from './UnsupportedBlock/UnsupportedBlock';

type BlocksToComponentsProps = Record<string, ReactNode>;

const defaultBlockMap : BlocksToComponentsProps = {
	'core/classic-editor': ClassicEditorBlock,
	'core/heading': Heading,
	'core/image': ImageBlock,
	'core/list': List,
	'core/paragraph': Paragraph,
	'core/quote': Quote,
	'core/table': Table,
	'unsupported': UnsupportedBlock,
}

export default defaultBlockMap;
