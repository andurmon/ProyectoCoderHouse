require("dotenv").config();

//Passport
const passport = require("passport");
const FacebookStrategy = require("passport-facebook").Strategy;
const { Users } = require("../models/users-model");

const loginStrategy = new FacebookStrategy(
    {
        clientID: process.argv[2]? process.argv[2] : process.env.FACEBOOK_APP_ID,
        clientSecret: process.argv[3]? process.argv[3] : process.env.FACEBOOK_APP_SECRET,
        callbackURL: "http://localhost:8080/productos/vista",
        // callbackURL: "http://localhost:8080/login",
        profileFields: ['id', 'displayName', 'photos', 'email']
    },
    (accessToken, refreshToken, profile, done) => {
        
        const findOrCreate = () => {
            console.log(accessToken, refreshToken, profile);
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
                done(error);
            })
        }
        process.nextTick(findOrCreate)
    }
)


const signUpStrategy = new FacebookStrategy(
    {
        clientID:       process.argv[2]? process.argv[2] : process.env.FACEBOOK_APP_ID,
        clientSecret:   process.argv[3]? process.argv[3] : process.env.FACEBOOK_APP_SECRET,
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