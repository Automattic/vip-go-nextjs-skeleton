import getRedisClient from './client';
import { log } from '@/lib/log';

export async function getCacheObjectByKey( key: string, ttl: number, fallback: () => Promise<any> ) {
	const redisClient = getRedisClient();

	if ( redisClient ) {
		log( `Redis: Request key "${key}"`, { key, ttl } );

		const cachedObject = await redisClient.get( key );

		if ( cachedObject ) {
			log( `Redis: Found key "${key}"`, { key, ttl } );

			return {
				source: 'cache',
				data: JSON.parse( cachedObject )
			};
		}
	}

	const fallbackObject = await fallback();

	if ( redisClient ) {
		log( `Redis: Set key "${key}"`, { key, ttl } );

		await redisClient.set(
			key,
			JSON.stringify( fallbackObject ),
			'ex',
			ttl
		);
	}

	return {
		source: 'fallback',
		data: fallbackObject,
	};
}
