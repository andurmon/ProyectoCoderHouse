const PORT = process.env.PORT || 8080;

const bcrypt = require("bcrypt")
const cookieParser = require("cookie-parser");
const session = require("express-session");

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);
require("./sockets/sockets")(io)

// Storage de Sesiones
const MongoStore = require("connect-mongo");
const RedisStore = require("connect-redis")(session);
const redisClient = require("redis").createClient(6379);

// const handlebars = require('express-handlebars');

// Routers y Middlewares
const productos = require("./routes/productos");
const {login} = require("./auth/login");

// Vistas y Motores de Plantilla
const {engineEJS: engine} = require("./routes/engine");
const testView = require("./routes/test.view");

//Passport
const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const { Users } = require("./models/users-model");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));
app.use(session({
    secret: "Secret",
    // store: new RedisStore({
    //     host: "localhost",
    //     port: 6379,
    //     client: redisClient,
    //     ttl: 300
    // }),
    store: MongoStore.create({
        mongoUrl: "mongodb+srv://andurmon:admin@cluster0.4b6ca.mongodb.net/ecommerce?retryWrites=true&w=majority",
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true},
        ttl: 10 * 60
    }),
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.use("login", new LocalStrategy(
    {
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
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
))

passport.serializeUser((user, done) => {
    done(null, user._id);
});
  
passport.deserializeUser((id, done) => {
    Users.findById(id, (err, user) => {
        done(err, user);
    });
});

// app.post("/login", login);
app.post("/login", passport.authenticate("login", {failureRedirect: '/login'} ), (req, res) => {
    res.redirect("/")
});

app.post("/logout", (req, res)=>{
    req.logout();
    res.send("Logout")
});

app.set("views", "./views");
app.set("view engine", "ejs");

app.get("/", (req, res) =>  res.redirect("/productos/vista") );

app.get('/agregar', (req, res)=>{

    if(!req.isAuthenticated()){
        res.sendFile(__dirname + '/public/logIn.html');
        return;
    }
    res.sendFile(__dirname + '/public/agregarProducto.html');
});

app.get('/productos/vista', (req, res)=> {

    if(!req.isAuthenticated()){
        res.sendFile(__dirname + '/public/logIn.html');
        return;
    }
    engine(req, res);
});

app.use('/productos/vista-test', testView);

app.get('/chat', (req, res)=> res.sendFile(__dirname + '/public/chat.html'));

// app.get('/styles/chat.css', (req, res)=>{
//     res.sendFile(__dirname + '/public/styles/chat.css');
// });

// REST API
app.use("/api/products", productos);

http.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});