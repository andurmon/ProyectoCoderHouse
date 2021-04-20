const mongoose = require("mongoose");
const { usersSchema } = require("./users-model");


const mensajesSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    sender: usersSchema,
    time: {type: Date, default:Date.now},
    message: {type: String, required: true}
})

const Mensajes = mongoose.model("mensajes", mensajesSchema);

module.exports = {
    mensajesSchema: mensajesSchema,
    Mensajes: Mensajes
}