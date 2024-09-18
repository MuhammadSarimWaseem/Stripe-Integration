const express = require('express');
const cors = require('cors');
require('dotenv').config();
const stripe = require('stripe')(process.env.STRIPE);
const app = express();

app.use(cors());
app.use(express.json());

app.post('/payment', async (req, res) => {
  const { cartItem } = req.body;

  try {
    if (!cartItem || cartItem.length === 0) {
      return res.status(400).json({ error: 'Cart is empty' });
    }

    const lineItems = await Promise.all(
      cartItem.map(async (item) => {
        if (!item.name || !item.image || !item.price) {
          throw new Error('Missing item details');
        }

        const product = await stripe.products.create({
          name: item.name,
          images: [item.image],
        });

        const price = await stripe.prices.create({
          product: product.id,
          unit_amount: item.price * 100,
          currency: 'usd',
        });

        return {
          price: price.id,
          quantity: 1,
        };
      })
    );

    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: 'http://localhost:3000/success',
      cancel_url: 'http://localhost:3000/cancel',
      customer_email: 'demo@gmail.com',
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating payment session:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.listen(3000, () => {
  console.log('Server running on port 3000');
});