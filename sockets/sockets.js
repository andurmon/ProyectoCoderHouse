// const {getChats, escribirChat} = require("../persistencia/mysql");
const {getChats, escribirChat} = require("../persistencia/mongodb");

const axios = require("axios");
const { Users } = require("../models/users-model");

module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log("Se conecto un usuario con ID: ", socket.id);
        
        getChats()
            .then( messages => {
                socket.emit("connection", {socketId: socket.id, chat: messages})
            })
            .catch(e => console.log(e))
            
        socket.on('add', payload => {
            axios.post(`${process.env.SERVER_URL}/api/products`, payload)
                .then((producto)=>socket.broadcast.emit('added', producto.data))
                .catch(()=>console.log("No se pudo"))
        })
    
        socket.on('remove', payload => {
            axios.post(`${process.env.SERVER_URL}/api/products/${payload}`)
                .then((producto)=>socket.broadcast.emit('removed', producto.data))
                .catch(()=>console.log("No se pudo"))
        })
        
        socket.on("chat-msg", (payload)=>{
            //Aqui irian metodos para guardar en un archivo los mensajes
            let {email, message} = payload;

            Users.findOne({email: email})
            .then(sender => {
                let time = new Date();
                escribirChat({ "sender": sender, "time": time.toString(), "message": message })
                    .then(()=> console.log("Se inserto el mensaje: ", { "sender": sender, "time": new Date(), "message": message }))
                    .catch(e => console.log(e))
        
                console.log(`${email} dijo ==> ${message}`);
                io.emit("chat-msg", {socketId: socket.id, sender: sender, message: message})
            })
            .catch(e => console.log(e))

            
        })
    
    });
    
}