const PORT = process.env.PORT || 8080;

const cookieParser = require("cookie-parser");
const session = require("express-session");

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const MongoStore = require("connect-mongo");
const RedisStore = require("connect-redis")(session);

const redisClient = require("redis").createClient(6379);

// const handlebars = require('express-handlebars');

const productos = require("./routes/productos");
const {engineEJS: engine} = require("./routes/engine");
const testView = require("./routes/test.view");
const { Users } = require("./models/users-model");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
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
        mongoOptions: {useNewUrlParser: true, useUnifiedTopology: true}
    }),
    resave: false,
    saveUninitialized: false
}));

require("./sockets/sockets")(io)

app.set("views", "./views");
app.set("view engine", "ejs");

app.post("/login", (req, res)=>{
    Users.findOne({email: req.body.email})
        .then(u => {
            console.log(u);
            if (!u){
                res.status(401).send("Not logged in");
                return;
            }
            req.session.username = u.nombre;
            req.session.email = u.email;
            req.session.loggedIn = true;
            res.send("Logged in");
        })
        .catch(e => {
            console.log(e);
            res.status(500).send("Error de servidor");
        })    
});

app.post("/logout", (req, res)=>{
    req.session.loggedIn = false;
    res.send("Logout")
    
});

app.get('/agregar', (req, res)=>{

    console.log("Sesion", req.session);

    if(!req.session.loggedIn){
        res.sendFile(__dirname + '/public/logIn.html');
        return;
    }

    res.sendFile(__dirname + '/public/agregarProducto.html');
});

app.get('/productos/vista', (req, res)=> {
    
    if(!req.session.loggedIn){
        res.sendFile(__dirname + '/public/logIn.html');
        return;
    }

    engine(req, res);
});

app.use("/api/products", productos);
app.use('/productos/vista-test', testView);
app.get('/chat', (req, res)=>{
    res.sendFile(__dirname + '/public/chat.html');    
});

app.get('/styles/chat.css', (req, res)=>{
    res.sendFile(__dirname + '/public/styles/chat.css');
});

http.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});