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

// Routers y Middlewares
const productos = require("./routes/productos");
const {login} = require("./auth/login");

// Vistas y Motores de Plantilla
const {engineEJS: engine} = require("./routes/engine");
const testView = require("./routes/test.view");

//Passport
const passport = require("passport");
const { loginStrategy, signUpStrategy, serializeUser, deserializeUser } =  require("./auth/passport")
const { loginStrategy: FacebookStrategy } = require("./auth/passportFacebook");

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

passport.use("login", loginStrategy);
passport.use("signup", signUpStrategy);
passport.use("login-facebook", FacebookStrategy);

passport.serializeUser( serializeUser );
passport.deserializeUser( deserializeUser );

app.post("/login", passport.authenticate("login", {failureRedirect: '/login'} ), (req, res) => {
    console.log("Hi");
    res.redirect("/productos/vista")
});

app.post("/login-facebook", passport.authenticate("login-facebook", {failureRedirect: '/login'} ), (req, res) => {
    console.log("Hi");
    res.redirect("/productos/vista")
});

app.post("/signup", passport.authenticate("signup", {failureRedirect: '/signup'}), (req, res) => {
    console.log("Request Body: ", req.body);
    res.redirect("login")
});

app.post("/logout", (req, res)=>{
    req.logout();
    res.send("Logout")
});

// Vistas - Front End desde el servidor
app.set("views", "./public/views");
app.set("view engine", "ejs");

app.get("/", (req, res) =>  res.redirect("/productos/vista") );

app.get("/login", (req, res) => {
    if (!req.isAuthenticated()){
        // res.sendFile(__dirname + '/public/logIn.html');
        res.render("layouts/logIn")
        return;
    }
    res.redirect("/productos/vista");
});

app.get("/signup", (req, res) => {
    res.render("layouts/signup")
})

app.get('/agregar', (req, res)=>{

    if(!req.isAuthenticated()){
        res.redirect("/login");
        return;
    }
    res.sendFile(__dirname + '/public/agregarProducto.html');
});

app.get('/productos/vista', (req, res)=> {

    if(!req.isAuthenticated()){
        res.redirect("/login");
        return;
    }
    engine(req, res);
});

app.use('/productos/vista-test', testView);

app.get('/chat', (req, res)=> res.sendFile(__dirname + '/public/chat.html'));

// REST API
app.use("/api/products", productos);

http.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});