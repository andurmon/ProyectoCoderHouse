const PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

// const handlebars = require('express-handlebars');

const productos = require("./routes/productos");
const {engineEJS: engine} = require("./routes/engine");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

require("./sockets/sockets")(io)

app.set("views", "./views");

app.set("view engine", "ejs")
app.get('/productos/vista', engine);

app.get('/agregar', (req, res)=>{
    res.sendFile(__dirname + '/public/agregarProducto.html');
});

app.get('/chat', (req, res)=>{
    res.sendFile(__dirname + '/public/chat.html');    
});

app.get('/productos/vista', engine);
app.use("/api/products", productos);

http.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});