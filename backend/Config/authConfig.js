const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../Models/UserModel.js');
const passport = require('passport');

passport.use(new GoogleStrategy({
  clientID: process.env.G_CLIENT_ID,
  clientSecret: process.env.G_CLIENT_SEC,
  callbackURL: "https://love-spark.vercel.app/auth/google/callback"
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ email: profile.emails[0].value });
        if (user) {
          done(null, user); // User already exists, proceed with authentication
        } else {
          // User doesn't exist, create a new user in the database
          const newUser = await User.create({
            FirstName: profile.name.givenName,
            LastName: profile.name.familyName?profile.name.familyName:'',
            email: profile.emails[0].value,
            bio:'',
            Gender:'',
            sexuality:'',
            age:'',
            Birthday:'',
            interests:[],
            occupation:'',
            Location:{
                country:'',
                State:'',
                city:'',
            },
            avatar:[{
              url:profile.photos[0].value
            }]
            
          });
          user = await newUser.save();
          done(null, user);
        }
      } catch (error) {
        done(error, null);
      }
    }
  )
)
passport.serializeUser((user,done)=>{
  done(null,user)
})

passport.deserializeUser((user,done)=>{
  done(null,user)
})


