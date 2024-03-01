import stripePackage from 'stripe';
import {config} from 'dotenv'
config()

const stripe = new stripePackage(process.env.STRIPE_SECRET);


export const stripe_Checkout_Session = async (req, res, next) => {
  // const line_items = [
  //   {
  //     price_data: {
  //       currency: "inr",
  //       product_data: {
  //         name: "Airbnb Item",
  //         images:
  //           "https://www.istockphoto.com/photo/solo-traveller-backpacker-gets-keys-from-room-owner-travel-short-term-rent-gm1414392057-463130459?utm_campaign=srp_photos_top&utm_content=https%3A%2F%2Funsplash.com%2Fs%2Fphotos%2Fairbnb&utm_medium=affiliate&utm_source=unsplash&utm_term=airbnb%3A%3A%3A",
  //         description: 'Some random description',
  //         metadata: {
  //           id: '1234',
  //         },
  //       },
  //       unit_amount: 40000 * 100,
  //     },
  //     quantity: 1,
  //   }
  // ]

  const line_items = [
    {
      price_data: {
        currency: 'inr',
        product_data: {
          name: "Airbnb Item",
          images:
           [ "https://media.istockphoto.com/id/1414392057/photo/solo-traveller-backpacker-gets-keys-from-room-owner-travel-short-term-rent-couchsurfing.jpg?s=1024x1024&w=is&k=20&c=W-nVNgKEIq4vQHPzWOL9CW-PfOaKgztpU42jcmPSmZo="],
        },
        unit_amount: 2000,
      },
      quantity: 1,
    },
  ]

  const session = await stripe.checkout.sessions.create({
    // payment_method_types: ["card"],
    line_items: line_items,
    mode: "payment",
    success_url: `http://localhost:5173/success`,
  });

  res.status(201).json({ url: session.url });
}





const express = require('express'); 
const proxy = require('http-proxy-middleware');

const router = express.Router();

const servers = [
  {
    host: 'localhost',
    port: 3000,
    weight: 1,
  },
  // Add more servers here
];

// Proxy middleware configuration
const proxyOptions = {
  target: '',
  changeOrigin: true,
  onProxyReq: (proxyReq, req) => {
    // Add custom header to request
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
  },
  logLevel: 'debug' 
};

// Next server index
let currIndex = 0;

// Get next server
function getServer() {

  // Round robin
  currIndex = (currIndex + 1) % servers.length;

  return servers[currIndex];
}


// Proxy requests
router.all('*', (req, res) => {
  
  // Get next target server
  const target = getServer();
  proxyOptions.target = `http://${target.host}:${target.port}`;
  
  // Forward request
  proxy(proxyOptions)(req, res); 
});

module.exports = router;