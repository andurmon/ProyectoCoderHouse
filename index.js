const PORT = process.env.PORT || 8080;

const axios = require("axios");
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const io = require("socket.io")(http);

const handlebars = require('express-handlebars');

const productos = require("./routes/productos");
const engine = require("./routes/engine");

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.get('/styles/chat.css', (req, res)=>{
    res.sendFile(__dirname + '/public/styles/chat.css');
})
const {getChats, escribirChat} = require("./archivos/archivos")
io.on('connection', (socket) => {
    console.log("Se conecto un usuario con ID: ", socket.id);
    
    getChats()
        .then( messages => socket.emit("connection", {socketId: socket.id, chat: messages}))
        .catch(e => console.log(e))
        
    socket.on('add', payload => {
        axios.post("http://localhost:8080/api/products" , payload)
            .then((producto)=>socket.broadcast.emit('added', producto.data))
            .catch(()=>console.log("No se pudo"))
    })

    socket.on('remove', payload => {
        axios.post(`http://localhost:8080/api/products/${payload}`)
            .then((producto)=>socket.broadcast.emit('removed', producto.data))
            .catch(()=>console.log("No se pudo"))
    })
    
    socket.on("chat-msg", (payload)=>{
        //Aqui irian metodos para guardar en un archivo los mensajes
        let {email, message} = payload;
        getChats()
            .then( messages => {
                messages.push( { sender: email, time: new Date(), message: message });
                escribirChat(messages);
            })
            .catch(e => console.log(e));

        console.log(`${email} dijo ==> ${message}`);
        io.emit("chat-msg", {socketId: socket.id, email: email, message: message})
    })

    // io.emit('removed', 15)
});

app.set("views", "./views");
app.engine("hbs",
    handlebars({
        extname:".hbs",
        defaultLayout:"vistaProductos.hbs",
        layoutsDir:__dirname+"/views/layouts/",
        partialsDir:__dirname +"/views/partials/"
    })
)

app.set("view engine", "hbs");

app.get('/agregar', (req, res)=>{
    res.sendFile(__dirname + '/public/agregarProducto.html');
});

app.get('/chat', (req, res)=>{
    res.sendFile(__dirname + '/public/chat.html');    
});

app.get('/productos/vista', engine);
app.use("/api/products", productos, ()=>{
    io.on("connection", socket => {
        socket.emit('saludo', 'A ver a ver a ver');
    })
});

http.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});