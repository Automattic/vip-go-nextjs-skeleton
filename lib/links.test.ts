import {
	extractLastTokenFromRoute,
	getInternalLinkPathname,
} from './links';

jest.mock( '@/lib/config', function () {
	return {
		get internalLinkHostnames () {
			return [
				'localhost',
				'mysite.example.com',
			];
		}
	};
} );

test( 'extractLastTokenFromRoute: extracts the last token from an array of tokens', function () {
	const input = [ 'one', 'two', 'three', 'four', 'five' ];
	expect( extractLastTokenFromRoute( input ) ).toBe( 'five' );
} );

test( 'extractLastTokenFromRoute: returns a string', function () {
	expect( extractLastTokenFromRoute( 'bare string' ) ).toBe( 'bare string' );
} );

test( 'getInternalLinkPathname: returns the path from various local URLs', function () {
	const internalLinks = [
		'http://localhost/howdy.html',
		'http://localhost/howdy.html',
		'https://localhost/howdy.html',
		'http://localhost:8888/howdy.html',
		'http://user:password@localhost/howdy.html',
		// Jest mocks are not currently working with new compiler:
		// https://github.com/vercel/next.js/pull/33731
		// 'http://mysite.example.com/howdy.html',
	];

	internalLinks.forEach( function ( link ) {
		expect( getInternalLinkPathname( link ) ).toBe( '/howdy.html' );
	} );
} );

test( 'getInternalLinkPathname: preserves the query string', function () {
	const internalLinksWithQuery = [
		'http://localhost/howdy.html?wave=true',
		'http://localhost/howdy.html?wave=true',
	];

	internalLinksWithQuery.forEach( function ( link ) {
		expect( getInternalLinkPathname( link ) ).toBe( '/howdy.html?wave=true' );
	} );
} );

test( 'getInternalLinkPathname: returns the full URL for non-local URLs', function () {
	const notInternalLinks = [
		'http://localhost.internal/howdy.html',
		'http://local.host/howdy.html',
		'https://localhost.com/howdy.html',
		'http://mysite2.example.com/howdy.html',
		'http://mysite.example/howdy.html',
	];

	notInternalLinks.forEach( function ( link ) {
		expect( getInternalLinkPathname( link ) ).toBe( link );
	} );
} );

test( 'getInternalLinkPathname: returns the input for malformed or non-HTTP URLs', function () {
	const malformedLinks = [
		'localhost',
		'localhost/howdy.html',
		'http://localhost:port/howdy.html',
		'ftp://localhost/howdy.html',
		'mailto:localhost',
		'suzy@localhost',
	];

	malformedLinks.forEach( function ( link ) {
		expect( getInternalLinkPathname( link ) ).toBe( link );
	} );
} );
