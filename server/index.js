const express = require('express');
const cors = require('cors');
require('dotenv').config();

const stripe = require('stripe')(process.env.STRIPE);
const app = express();

app.use(cors());
app.use(express.json());

app.get('/', (req, res) => {
  res.send('Hello World');
});

app.post('/payment', async (req, res) => {
  const { cartItem } = req.body;

  try {
    if (!cartItem || cartItem.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = await Promise.all(
      cartItem.map(async (item) => {
        // Validate that each item has the necessary properties
        if (!item.name || !item.image || !item.price) {
          throw new Error('Missing item details');
        }

        // Create product in Stripe
        const product = await stripe.products.create({
          name: item.name,
          images: [item.image],
        });

        // Create price for the product
        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: item.price * 100, // Convert to cents
          currency: 'usd',
        });

        // Return the line item to be added to the session
        return {
          price: price.id,
          quantity: 1, // Adjust quantity as needed
        };
      })
    );

    // Create the Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      customer_email: 'demo@gmail.com', // You can also pass dynamic email
    });

    // Send the session URL to the frontend
    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
