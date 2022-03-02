import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';
import { log, logError } from '@/lib/log';
import { getCacheObjectByKey } from '@/lib/redis';

/**
 * Find out if the Internet Archive has a book.
 */
export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	// Don Quixote (Penguin Classics, English)
	// By MIGUEL DE CERVANTES SAAVEDRA
	// Introduction by Roberto Gonzalez Echevarria
	// Translated by John Rutherford
	// Notes by John Rutherford
	// https://www.penguinrandomhouse.com/books/286572/
	const defaultIsbn = '0142437239';

	const isbn = `${ req.query.isbn || defaultIsbn }`;
	const cacheKey = `internet_archive_isbn_${ isbn }`;
	const ttl = 30;

	// Fallback function to fetch the book when cache object is not available.
	async function fallback () {
		log( 'Fetching book by ISBN', { isbn } );

		const baseUrl = 'https://archive.org/services/book/v1/do_we_have_it/';
		const url = `${ baseUrl }?isbn=${ isbn }&include_unscanned_books=true`;
		const response = await fetch( url );

		return response.json();
	}

	try {
		const book = await getCacheObjectByKey( cacheKey, ttl, fallback );
		return res.status( 200 ).send( book );
	} catch ( err ) {
		logError( err, {} );

		return res.status( 500 ).send( err );
	}
}
