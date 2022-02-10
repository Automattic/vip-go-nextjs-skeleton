import { ContentBlock } from '@/graphql/generated';

type Props = {
	block: ContentBlock,
};

export default function Table ( { block: { innerHTML }, ...props } : Props ) {
	return (
		<table
			cellPadding={ 0 }
			cellSpacing={ 0 }
			dangerouslySetInnerHTML={ { __html: innerHTML } }
			{...props}
		/>
	);
}
