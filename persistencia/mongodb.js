const {Mensajes: Model} = require("../models/mensajes-model");

function getChats() { return Model.find(); }

async function escribirChat(chat){ 
    const newDocument = await new Model(chat);
    await newDocument.save();
}

module.exports = {
    getChats: getChats,
    escribirChat: escribirChat
}