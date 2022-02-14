import { BlockProps } from '../index';

export default function Table ( { block: { innerHTML }, ...props }: BlockProps ) {
	return (
		<table
			cellPadding={ 0 }
			cellSpacing={ 0 }
			dangerouslySetInnerHTML={ { __html: innerHTML } }
			{...props}
		/>
	);
}
