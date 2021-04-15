// const {getChats, escribirChat} = require("../persistencia/mysql");
const {getChats, escribirChat} = require("../persistencia/mongodb");
const {normalize, denormalize} = require("../normlize/normalizeChat");
const axios = require("axios");

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("Se conecto un usuario con ID: ", socket.id);
        
        getChats()
            .then( messages => {
                console.log(messages)
                let normMessages = normalize(messages);
                console.log("Norm => ", normMessages)
                console.log("Denorm => ", denormalize(normalize(messages)))
                socket.emit("connection", {socketId: socket.id, chat: normMessages})
            })
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
            let time = new Date();
            escribirChat({ "sender": email, "time": time.toString(), "message": message })
                .then(()=> console.log("Se inserto el mensaje: ", { "sender": email, "time": new Date(), "message": message }))
                .catch(e => console.log(e))
    
            console.log(`${email} dijo ==> ${message}`);
            io.emit("chat-msg", {socketId: socket.id, email: email, message: message})
        })
    
    });
    
}