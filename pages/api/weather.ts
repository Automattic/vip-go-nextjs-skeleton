import type { NextApiRequest, NextApiResponse } from 'next'
import fetch from 'node-fetch'
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
	const appId = '79565f7203b09794f3f049346c2cb9d4';
	const city = `${ req.query.city || 'London' }`;
	const cacheKey = `weather_api_response_${ city.toLowerCase() }`;
	const fallback = () => getWeather( city, appId );
	const ttl = 30;

	try {
		const weather = await getCacheObjectByKey( cacheKey, ttl, fallback );
		return res.status( 200 ).send( weather );
	} catch ( err ) {
		return res.status( 500 ).send( err );
	}
}
