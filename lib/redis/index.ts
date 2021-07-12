import RedisClient, { Redis } from 'ioredis'

let redisClient: Redis;

function getRedisClient (): Redis {
	if ( process.env.VIP_REDIS_PRIMARY && ! redisClient ) {
		const [ host, port ] = process.env.VIP_REDIS_PRIMARY.split( ':' );
		const password = process.env.VIP_REDIS_PASSWORD;

		redisClient = new RedisClient( {
			host,
			password,
			port: parseInt( port, 10 ),
		} );
	}

	return redisClient;
}

export async function getCacheObjectByKey( key: string, ttl: number, fallback: () => Promise<any> ) {
	const redisClient = getRedisClient();

	if ( redisClient ) {
		const cachedObject = await redisClient.get( key );

		if ( cachedObject ) {
			return {
				source: 'cache',
				data: JSON.parse( cachedObject )
			};
		}
	}

	const fallbackObject = await fallback();

	if ( redisClient ) {
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
