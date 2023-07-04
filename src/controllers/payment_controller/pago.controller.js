const express = require('express');
const app = express();
const stripe= require('stripe')('sk_test_51JHYndD02CiszKzfzo8MopJo3ozNulJpq4bOGBi7OC89wsMu3FcShkTQSqke0kkBIAYG8mt1Kvfi9NGcCcwi9EDT00aLHjH6Dk');
app.use(express.static('public'));
app.use(express.json());



async function pago(req,res){

	const calculateOrderAmount = () => {
		// Replace this constant with a calculation of the order's amount
		// Calculate the order total on the server to prevent
		// people from directly manipulating the amount on the client
		return 200;
	};

	console.log('PAGO DE STRIPE');
	const { items } = req.body;

	// Create a PaymentIntent with the order amount and currency
	const paymentIntent = await stripe.paymentIntents.create({
		amount: calculateOrderAmount(items),
		currency: 'usd',
		automatic_payment_methods: {
			enabled: true,
		},
	});
  
	res.send({
		clientSecret: paymentIntent.client_secret,
	});

}

module.exports={
	pago
}; 

