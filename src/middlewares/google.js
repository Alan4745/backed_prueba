var passport = require('passport');
var GoogleStrategy = require('passport-google-oauth20');


passport.use('auth-google',new GoogleStrategy({
	clientID: process.env.GOOGLE_CLIENT_ID,
	clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	callbackURL: 'https://backend-dimension.onrender.com/api/google/callback'
},
async (accessToken, refreshToken, profile,done)  => {

	return done(null, profile);
}
));

passport.serializeUser((user, done) => {
	done(null, user);
});

passport.deserializeUser((user, done) => {
	done(null, user);
});