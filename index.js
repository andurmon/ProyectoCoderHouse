const PORT = process.env.PORT || 8080;

const cookieParser = require("cookie-parser");
const session = require("express-session");

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// const handlebars = require('express-handlebars');

const productos = require("./routes/productos");
const {engineEJS: engine} = require("./routes/engine");
const testView = require("./routes/test.view");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cookieParser());
app.use(session({
    secret: "Secret",
    resave: false,
    saveUninitialized: false
}));

require("./sockets/sockets")(io)

app.set("views", "./views");
app.set("view engine", "ejs")
app.get('/productos/vista', engine);

app.post("/login", (req, res)=>{
    req.session.loggedIn = true;
    console.log(req.body);
    res.send("Loggin in");
});

app.get("/logout", (req, res)=>{
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

app.get('/chat', (req, res)=>{
    res.sendFile(__dirname + '/public/chat.html');    
});

app.get('/productos/vista', engine);
app.use("/api/products", productos);
app.use('/productos/vista-test', testView);

http.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});