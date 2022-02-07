type Props = {
	innerHTML: string,
};

export default function Table ( { innerHTML, ...props }: Props ) {
	return (
		<table
			cellPadding={ 0 }
			cellSpacing={ 0 }
			dangerouslySetInnerHTML={ { __html: innerHTML } }
			{...props}
		/>
	);
}
