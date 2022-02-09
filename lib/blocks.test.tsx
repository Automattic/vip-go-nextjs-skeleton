import { mapAttributesToProps, mapBlockNamesToComponents } from './blocks';

test( 'mapAttributesToProps: returns a props-like object', function () {
	const attributes = [
		{
			name: 'foo',
			value: 'bar',
		},
		{
			name: 'fizz',
			value: 'buzz',
		},
		{
			name: 'far',
			value: 'near',
		},
	];

	expect( mapAttributesToProps( attributes ) ).toEqual( {
		foo: 'bar',
		fizz: 'buzz',
		far: 'near',
	} );
} );

test( 'mapAttributesToProps: drops attributes that have falsy names or values', function () {
	const attributes = [
		{
			value: 'bar',
		},
		{
			name: 'foo',
		},
		{
			name: 'far',
			value: null,
		},
	];

	expect( mapAttributesToProps( attributes ) ).toEqual( {} );
} );

test( 'mapBlockNamesToComponents: returns the default object', function () {
	const blocks = Object.keys( mapBlockNamesToComponents( ) );

	expect( blocks ).toContain( 'core/classic-editor' );
	expect( blocks ).toContain( 'core/heading' );
	expect( blocks ).toContain( 'core/image' );
	expect( blocks ).toContain( 'core/list' );
	expect( blocks ).toContain( 'core/paragraph' );
	expect( blocks ).toContain( 'core/quote' );
	expect( blocks ).toContain( 'core/table' );
	expect( blocks ).toContain( 'unsupported' );
} );

test( 'mapBlockNamesToComponents: returns the default object overriding a block', function () {
	const componentsDefault = mapBlockNamesToComponents( );
	const components = mapBlockNamesToComponents( {
		'core/classic-editor': componentsDefault['core/heading'],
	} );

	expect ( components[ 'core/classic-editor' ] ).toEqual( componentsDefault['core/heading'] ) ;
	expect ( Object.entries( components ).length ).toEqual( Object.entries( componentsDefault ).length ) ;
} );

test( 'mapBlockNamesToComponents: returns the default object adding a new block', function () {
	const componentsDefault = mapBlockNamesToComponents( );
	const components = mapBlockNamesToComponents( {
		'core/new-block': componentsDefault['core/heading'],
	} );

	expect ( components[ 'core/new-block' ] ).toBeDefined(  ) ;
	expect ( Object.entries( components ).length ).toEqual( Object.entries( componentsDefault ).length + 1 ) ;
} );
