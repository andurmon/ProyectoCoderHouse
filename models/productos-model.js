const mongoose = require("mongoose");

const productosSchema = new mongoose.Schema({
    id: mongoose.ObjectId,
    title: {type: String, required: true},
    price: {type: Number, required: true},
    thumbnail: {type: String, dafault: ""},
})

const Productos = mongoose.model("productos", productosSchema);

module.exports = {
    productosSchema: productosSchema,
    Productos: Productos
}