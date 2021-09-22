import type { NextApiRequest, NextApiResponse } from 'next';
import fetch from 'cross-fetch';
import { log, logError } from '@/lib/log';
import { getCacheObjectByKey } from '@/lib/redis';

/**
 * Fetch weather for a city from OpenWeatherMap.
 */
async function getWeather ( city: string, appId: string ): Promise<any> {
	const baseUrl = 'https://api.openweathermap.org/data/2.5/weather';
	const response = await fetch( `${ baseUrl }?q=${ city }&appid=${ appId }` );

	return response.json();
}

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	// @ts-ignore: Express locals are not defined on Next.js request.
	const { requestContext } = res.locals;

	const appId = 'YOUR_OPENWEATHERMAP_APP_ID';
	const city = `${ req.query.city || 'London' }`;
	const cacheKey = `weather_api_response_${ city.toLowerCase() }`;
	const ttl = 30;

	// Fallback function to fetch weather when cache object is not available.
	const fallback = () => {
		log( 'Fetching weather', { city }, requestContext );

		return getWeather( city, appId );
	};

	try {
		const weather = await getCacheObjectByKey( cacheKey, ttl, fallback );
		return res.status( 200 ).send( weather );
	} catch ( err ) {
		// @ts-ignore: Express locals are not defined on Next.js request.
		logError( err, {}, requestContext );

		return res.status( 500 ).send( err );
	}
}
