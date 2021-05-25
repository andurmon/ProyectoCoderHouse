require("dotenv").config();

const { logger } = require("./logging.js");

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

// Routers y Middlewares
const productos = require("./routes/productos");

// Vistas y Motores de Plantilla
const {engineEJS: engine} = require("./routes/engine");
const testView = require("./routes/test.view");

//Passport
const passport = require("passport");
const { loginStrategy, signUpStrategy, serializeUser, deserializeUser } =  require("./auth/passport")
const { loginStrategy: FacebookStrategy } = require("./auth/passportFacebook");

// COMPRESION GZIP
const compression = require("compression");
app.use(compression())

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(express.static("public"));
logger.trace(process.env.MONGO_URL)
app.use(session({
    secret: process.env.SECRET,
    store: MongoStore.create({
        mongoUrl: process.env.MONGO_URL,
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
passport.use(FacebookStrategy);

passport.serializeUser( serializeUser );
passport.deserializeUser( deserializeUser );

app.post("/login", passport.authenticate("login", {failureRedirect: '/login'} ), (req, res) => {
    logger.trace("Hi");
    res.redirect("/productos/vista")
});

app.post("/login-facebook", passport.authenticate("facebook", {failureRedirect: '/fail'} ), (req, res) => {
    logger.trace("Hi");
    res.redirect("/productos/vista")
});

app.post("/signup", passport.authenticate("signup", {failureRedirect: '/signup'}), (req, res) => {
    logger.debug("Request Body: ", req.body);
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
        res.render("layouts/logIn", {url : process.env.SERVER_URL})
        return;
    }
    res.redirect("/productos/vista");
});

app.get("/signup", (req, res) => {
    res.render("layouts/signup",  {url : process.env.SERVER_URL})
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

app.get('/info', (req, res) => {
    res.render("layouts/infoProcess", process);
});

const { fork } = require("child_process");
app.get('/randoms/:cantidad', (req, res) =>{
    
    const forked = fork("./child-processes/random.js");

    forked.send({cantidad: req.params.cantidad, min : 1, max : 1000});

    forked.on("message", msg =>{
        res.send(msg)
    })

});

http.listen(PORT, ()=>{
    logger.info(`Servidor express escuchando en el puerto ${PORT} - PID WORKER ${process.pid}`);
    // logger.info("Argumentos del proceso", process.argv);
});

process.on("beforeExit", (coce) => {
    logger.warn('Process Before Exit', code);
})