const stripe = require('stripe')('sk_test_51OrAWUBeXfCfFgH0j6CAXRTUAaMr0b6I8ivlBGfEmE7vT72y8LIdWhhyma2vuwsUjbv1s33lKsVbpKKYuCQ7k3i400nEsxqBA8');

async function paymentTest(req, res) {
	// Use an existing Customer ID if this is a returning customer.
	console.log(req.body.price);

	const {price} = req.body;

	const customer = await stripe.customers.create();
	const ephemeralKey = await stripe.ephemeralKeys.create(
		{customer: customer.id},
		{apiVersion: '2023-10-16'}
	);
	const paymentIntent = await stripe.paymentIntents.create({
		amount: price   ,
		currency: 'usd',
		customer: customer.id,
		// In the latest version of the API, specifying the `automatic_payment_methods` parameter
		// is optional because Stripe enables its functionality by default.
		automatic_payment_methods: {
			enabled: true,
		},
	});
  
	res.json({
		paymentIntent: paymentIntent.client_secret,
		ephemeralKey: ephemeralKey.secret,
		customer: customer.id,
		publishableKey: 'pk_test_51OrAWUBeXfCfFgH08tW9gRFBnKuom98Q3KodWlQBFERw2LpD7vdpYSRBQgaC9hADilmtMYR7ELqs8onL5MrgQhoI00u6jj1ln3'
	});
}


module.exports = {
	paymentTest
};

// app.post('/payment-sheet', async (req, res) => {
	
// });