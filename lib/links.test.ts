import {
	extractLastTokenFromRoute,
	getInternalLinkPathname,
} from './links';
import { links } from '../vip.config';

jest.mock( '../vip.config', function () {
	return {
		links: {
			isInternalLink: jest.fn( () => true ),
		},
	};
} );

describe( 'extractLastTokenFromRoute', () => {
	it( 'extracts the last token from an array of tokens', function () {
		const input = [ 'one', 'two', 'three', 'four', 'five' ];
		expect( extractLastTokenFromRoute( input ) ).toBe( 'five' );
	} );

	it( 'returns a string', function () {
		expect( extractLastTokenFromRoute( 'bare string' ) ).toBe( 'bare string' );
	} );
} );

describe( 'isInternalLink default implementation', () => {
	const unmockedVipConfig = jest.requireActual( '../vip.config' );

	it( 'returns true for local hostnames', function () {
		const internalHostnames = [
			'127.0.0.1',
			'localhost',
		];

		internalHostnames.forEach( function ( hostname ) {
			expect( unmockedVipConfig.links.isInternalLink( hostname ) ).toBe( true );
		} );
	} );

	it( 'returns false for non-local hostnames', function () {
		const externalHostnames = [
			'localhost.internal',
			'local.host',
			'localhost.com',
			'mysite.example.com',
			'mysite2.example.com',
		];

		externalHostnames.forEach( function ( hostname ) {
			expect( unmockedVipConfig.links.isInternalLink( hostname ) ).toBe( false );
		} );
	} );
} );

describe( 'getInternalLinkPathname', () => {
	const isInternalLink = ( links.isInternalLink as jest.MockedFunction<typeof links.isInternalLink> );

	beforeEach( () => {
		isInternalLink.mockClear();
	} );

	it( 'preserves the query string', function () {
		const internalLinkWithQuery = 'http://localhost/howdy.html?wave=true';

		expect( getInternalLinkPathname( internalLinkWithQuery ) ).toEqual( '/howdy.html?wave=true' );
	} );

	it( 'returns the full URL for non-local URLs', function () {
		const externalLink = 'http://localhost/howdy.html';

		isInternalLink.mockImplementation( () => false );

		expect( getInternalLinkPathname( externalLink ) ).toEqual( externalLink );
	} );

	it( 'does nothing to malformed or non-HTTP URLs', function () {
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
} );
