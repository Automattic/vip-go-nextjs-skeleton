const nextJest = require( 'next/jest' )

module.exports = nextJest( {
	dir: './',
} )( {
	moduleNameMapper: {
		"^@/(components|graphql|lib|pages|styles)/(.*)$": "<rootDir>/$1/$2",
	},
	testMatch: [
		'**/__tests__/**/*.+(ts|tsx|js)',
		'**/*.(spec|test).+(ts|tsx|js)'
	],
} );
