import { new_Booking } from "../controllers/booking.controller.js";



// This is your Stripe CLI webhook secret for testing your endpoint locally.
// const endpointSecret = "whsec_47ca9255c6de47f0439620939ad1d874a07d485d3637ab6f1d20141891f5acc2";
export const stripe_Webhook_Handler = async (req, res, next) => {
    let data;
    let eventType;
  
    // Check if webhook signing is configured.
    let webhookSecret;
    //webhookSecret = process.env.STRIPE_WEB_HOOK;
  
    if (webhookSecret) {
      // Retrieve the event by verifying the signature using the raw body and secret.
      let event;
      let signature = req.headers["stripe-signature"];
  
      
      try {
        event = stripe.webhooks.constructEvent(
          req.body,
          signature,
          webhookSecret
        );
      } catch (err) {
        console.log(`⚠️  Webhook signature verification failed:  ${err}`);
        return res.sendStatus(400);
      }
  
      // Extract the object from the event.
      data = event.data.object;
      eventType = event.type;
    } else {
      // Webhook signing is recommended, but if the secret is not configured in `config.js`,
      // retrieve the event data directly from the request body.
      data = req.body.data.object;
      eventType = req.body.type;
      // console.log('Data: ', data)
    //   console.log('Event Type: ', eventType)
    }
  
    // Handle the checkout.session.completed event
    if (eventType === "checkout.session.completed") {
      new_Booking(data.metadata)
    }
  
    res.status(200).end();
  }