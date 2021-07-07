import Redis from 'ioredis'
import fetch from 'node-fetch'

let redisClient;

export default async ( city = "London" ) => {
	if ( process.env.VIP_REDIS_PRIMARY && ! redisClient ) {
		const [ host, port ] = process.env.VIP_REDIS_PRIMARY.split( ':' );
		const password = process.env.VIP_REDIS_PASSWORD;

		redisClient = new Redis( {
			host: host,
			port: port,
			password: password,
		} );
	}

	const cache_key = 'weather_api_response_' + city.toLowerCase();

	let cache = redisClient && await redisClient.get( cache_key );

	if ( redisClient && cache ) {
		return Promise.resolve( {
			source: 'cache',
			data: JSON.parse( cache )
		} );
	}

	return fetch( `https://api.openweathermap.org/data/2.5/weather?q=${ city }&appid=79565f7203b09794f3f049346c2cb9d4` )
		.then(r => {
			return r.json()
		} )
		.then( data => {
			// Add key to redis with an expiration of 10 secondes
			redisClient && redisClient.set( cache_key, JSON.stringify(data), 'ex', 10 );
			return {
				source: 'api',
				data: data
			};
		} )
}