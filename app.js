import express from 'express'
import {Strategy as GoogleStrategy} from 'passport-google-oauth20'
import {config} from 'dotenv'
import cookieParser from 'cookie-parser'
import morgan from 'morgan'
import cors from 'cors'
import userRouter from './routes/user.route.js'
import property_Router from './routes/property.route.js'
import booking_Router from './routes/booking.route.js'
// import cookieSession from 'cookie-session'
import google_Router from './oauth/google.route.js'
import passport from 'passport'
import session from 'express-session'



// Initalizing express
const app = express()
config()


// Middlewares
app.use(express.json({limit: '10mb', extended: 'true'}))
app.use(express.urlencoded({type: '10mb', extended: 'true'}))
app.use(morgan('dev'))
app.use(cookieParser())
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))



// Passport setup
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      callbackURL: "/auth/google/callback",
      scope: ['profile', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
      // console.log('Successful google oauth: ', profile);
      done(null, profile);
    }
  )
);


passport.serializeUser((user, done) => {
  done(null, user);
});


passport.deserializeUser((user, done) => {
  done(null, user);
});


app.use(session({
    secret: 'jeoj434WW39239i@@',
    resave: true,
    saveUninitialized: true
}));

app.use(passport.initialize());
app.use(passport.session());




app.get(
  "/auth/google",
  passport.authenticate("google", ["profile", "email"])
//   passport.authenticate("google", { scope: ["profile", "email"] })
);


app.get(
  "/auth/google/callback",
  passport.authenticate("google", { failureRedirect: "/" }),
  (req, res) => {
    // Redirect after successful authentication
    console.log('User object: ', req.user)
    res.redirect("http://localhost:5173");
  }
);


app.get("/logout", (req, res) => {
  req.logout();
  res.redirect("/");
});



// Route Middlewares
app.use('/api/user', userRouter)
app.use('/api/property', property_Router)
app.use('/api/booking', booking_Router)
app.use('/auth', google_Router)



// Error Middleware
app.use((err, req, res, next) => {
    const errorStatus = err.status || 500
    const errorMessage = err.message || 'Something went wrong'

    res.status(errorStatus).json({
        success: false,
        status: errorStatus,
        message: errorMessage,
        stack: err.stack
    })
})



export default app