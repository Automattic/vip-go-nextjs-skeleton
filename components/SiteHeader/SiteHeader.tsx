import Link from 'next/link';

/**
 * Data loading must take place in pages (or be client-side only). If you need
 * data to load this header, you must pass it down as props.
 */
export default function SiteHeader() {
	return (
		<header>
			<h1>VIP Decoupled Starter</h1>
			<nav>
				<Link href="/">Home</Link>
				{` / `}
				<Link href="/admin">Admin</Link>
			</nav>
		</header>
	);
}
