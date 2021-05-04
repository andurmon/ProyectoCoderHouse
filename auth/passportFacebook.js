//Passport
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { Users } = require("../models/users-model");

const FACEBOOK_APP_ID = "2982625835302934";
const FACEBOOK_APP_SECRET = "cd9f8048ee2e534d68751630056435c9";

const loginStrategy = new FacebookStrategy(
    {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8080/login",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (req, username, password, done) => {
        
        Users.findOne({email: username})
            .then(userDocument => {
                if(!userDocument) return done('Invalid Email');

                const passwordsMatch = password === userDocument.password;
                if (!passwordsMatch) return done('Invalid Password');
                
                req.session.username = userDocument.nombre;
                req.session.email = userDocument.email;

                return done(null, userDocument); 
            })
            .catch ((error) => {
                done("Mail not found, please Sign Up" + error);
            })
        }
)


const signUpStrategy = new FacebookStrategy(
    {
        clientID: FACEBOOK_APP_ID,
        clientSecret: FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8080/sigup",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (req, username, password, done) => {
        console.log("Passport signup ome : " , req.body);
        Users.findOne({email: username})
            .then(userDocument => {
                if(userDocument) return done("Mail ya registrado");
                
                let newUser = new Users(req.body);

                newUser.save((err) => {
                    if (err) {
                        console.log("Error in Saving user: " + err);
                        throw err;
                    }
                    console.log("User Registration succesful");
                    req.session.username = newUser.nombre;
                    req.session.email = newUser.email;
                    return done(null, newUser);
                });                
            })
            .catch ((error) => {
                done(error);
            })
        }
)

const serializeUser = (user, done) => {
    done(null, user._id);
}

const deserializeUser = (id, done) => {
    Users.findById(id, (err, user) => {
        done(err, user);
    });
}

module.exports = {
    loginStrategy: loginStrategy,
    signUpStrategy: signUpStrategy,
    serializeUser: serializeUser,
    deserializeUser: deserializeUser
}