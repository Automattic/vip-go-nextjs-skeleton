import weather from '@/lib/weather';

export default async function handler( _, res ) {
	return weather( _.query.city ).then( r => {
		return res.status( 200 ).send( r );
	} ).catch( e => {
		return res.status( 500 ).send( e );
	} )
}
