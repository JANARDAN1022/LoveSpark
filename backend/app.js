const express = require('express');
const bodyparser = require('body-parser');
const cookieParser = require('cookie-parser');
const ErrorHandler = require('./Middlewares/ErrorHandler.js');
//const fileupload = require('express-fileupload');
const passport = require('passport');
const cookieSession = require('cookie-session');
//const session = require('express-session');
const cors = require('cors');
const UserRoutes = require('./Routes/UserRoutes.js');
const GoogleRoutes = require('./Routes/GoogleRoutes.js');
const ChatRoutes = require('./Routes/ChattingRoutes/ChatRoute.js');
const MessageRoutes = require('./Routes/ChattingRoutes/MessageRoute.js');
const SwipedRoutes = require('./Routes/swipeRoutes.js');
const MatchedRoutes = require('./Routes/MatchesRoutes.js');
const ReportRoutes = require('./Routes/ReportRoutes.js');
const Stripe = require('stripe')(process.env.Stripe_Sec_Key);
const app = express();


app.use(bodyparser.urlencoded({extended:true}));
app.use(cookieSession({name:'Session',keys:[process.env.SessionKey],maxAge:process.env.Age}));
/*app.use(session({
    secret:process.env.SessionKey,
    resave: false,
    saveUninitialized: true
  }));*/
app.use(passport.initialize());
app.use(passport.session());

const allowedOrigins = [
  'http://localhost:3000', // Add other origins as needed
  'https://Love-Spark-frontend.vercel.app', // Remove the trailing slash from the URL
];

app.use(cors({
  origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
          callback(null, true);
      } else {
          callback(new Error('Not allowed by CORS'));
      }
  },
  credentials: true
}));

app.use(express.json());
app.use(cookieParser());

app.post('/create-checkout-session', async (req, res) => {
  try {
    const session = await Stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: [
        {
          price_data: {
            currency: 'usd',
            product_data: {
              name: 'Love Spark Premium',
            },
            unit_amount: 39900, // Amount in cents ($399 * 100)
          },
          quantity: 1, // Only one Premium version
        },
      ],
      success_url: `${process.env.CLIENT}/StripeSuccess`, // Redirect to success page
      cancel_url: `${process.env.CLIENT}/StripeFail`, // Redirect to cancel page
    });

    res.json({ url: session.url });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});


app.use('/api/Users/',UserRoutes);
app.use('/auth/',GoogleRoutes);
app.use('/api/chat/',ChatRoutes);
app.use('/api/Messages/',MessageRoutes);
app.use('/api/Swipe/',SwipedRoutes);
app.use('/api/Matches/',MatchedRoutes);
app.use('/api/Reports/',ReportRoutes);
app.use(ErrorHandler);


app.get('/',(req,res)=>{
  res.json('Wroking, Hello From loveSpark');
  });



module.exports = app;