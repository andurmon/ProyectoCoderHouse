const mongoose = require("mongoose");

const mensajesSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    sender: {type: Object, required: true},
    time: {type: Date, default:Date.now},
    message: {type: String, required: true}
})

const Mensajes = mongoose.model("mensajes", mensajesSchema);

module.exports = {
    mensajesSchema: mensajesSchema,
    Mensajes: Mensajes
}