import weather from '@/lib/weather';
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler( req: NextApiRequest, res: NextApiResponse ) {
	return weather( `${req.query.city}` ).then( r => {
		return res.status( 200 ).send( r );
	} ).catch( e => {
		return res.status( 500 ).send( e );
	} )
}
