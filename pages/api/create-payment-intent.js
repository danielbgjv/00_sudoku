import Stripe from 'stripe';

const stripe = new Stripe( process.env.STRIP_SECRET_KEY );

export default async function handler( req, res ) {
    if ( req.method === 'POST' ) {
        const { currency, productName } = req.body;

        try {
            const paymentIntent = await stripe.paymentIntents.create( {
                amount: 500, // Exemplo: $5.00
                currency: currency,
                description: productName,
                payment_method_types: [ 'card' ],
            } );

            console.log( paymentIntent );

            res.status( 200 ).json( { clientSecret: paymentIntent.client_secret } );
        } catch ( error ) {
            console.error( error );
            res.status( 500 ).json( { error: 'Erro ao criar PaymentIntent' } );
        }
    } else {
        res.status( 405 ).json( { error: 'Método não permitido' } );
    }
}
