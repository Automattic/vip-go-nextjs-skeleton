import Link from 'next/link';

/**
 * Server-side data loading must take place in pages. If you need to load data
 * to render this component, you must pass it down as props (or load it client-
 * side.)
 */
export default function SiteFooter() {
	return (
		<>
			<hr />
			<nav>
				<Link href="/search">Search</Link>
			</nav>
		</>
	);
}

