const {Mensajes} = require("../models/mensajes-model");
const {Productos} = require("../models/productos-model");

function getProductos() {return Productos.find();}

function getChats() { return Mensajes.find(); }

async function escribirChat(chat){ 
    const newDocument = await new Mensajes(chat);
    await newDocument.save();
}

module.exports = {
    getProductos: getProductos,
    getChats: getChats,
    escribirChat: escribirChat
}