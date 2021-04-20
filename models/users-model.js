const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
    email: {type: String, required: true},
    nombre: {type: String, required: true},
    apellido: {type: String, required: true},
    edad: {type: Number, required: true},
    alias: {type: String, required: true},
    avatar: {type: String, default: ""},
})

const Users = mongoose.model("users", usersSchema);

module.exports = {
    usersSchema: usersSchema,
    Users: Users
}