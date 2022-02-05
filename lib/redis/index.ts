import getRedisClient from './client';
import { log } from '@/lib/log';

export async function getCacheObjectByKey<T>( key: string, ttl: number, fallback: () => Promise<T> ) {
	const redisClient = getRedisClient();

	function logRedisEvent ( message: string ) {
		log( `Redis: ${message}`, { key, ttl } );
	}

	if ( ! redisClient ) {
		logRedisEvent( 'Not available!' );
	}

	if ( redisClient ) {
		logRedisEvent( `Request key "${key}"` );

		const cachedObject = await redisClient.get( key );

		if ( cachedObject ) {
			logRedisEvent( `Found key "${key}"` );

			return {
				source: 'cache',
				data: JSON.parse( cachedObject )
			};
		}
	}

	const fallbackObject = await fallback();

	if ( redisClient ) {
		logRedisEvent( `Set key "${key}"` );

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
