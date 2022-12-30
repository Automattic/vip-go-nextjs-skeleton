import root from 'react-shadow';

type Props = {
	content: string,
};

export default function PostContentShadow( { content } : Props ) {
	return (
		<root.div>
			<link rel="stylesheet" href="http://decoupled.vipdev.lndo.site/wp-includes/css/dist/block-library/style.css"/>
			<link rel="stylesheet" href="http://decoupled.vipdev.lndo.site/wp-includes/css/dist/block-library/theme.css"/>
			<link rel="stylesheet" href="http://decoupled.vipdev.lndo.site/wp-json/vip-decoupled-styles/v1/styles"/>

			<body dangerouslySetInnerHTML={{ __html: content }} />
		</root.div>
	);
}
