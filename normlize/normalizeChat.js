
const {normalize, denormalize, schema} = require("normalizr");

const autor = new schema.Entity("Autor", {}, {idAttribute: "_id"});
const mensaje = new schema.Entity("Mensajes", {
    sender: autor
}, {idAttribute: "_id"});


module.exports = {
    normalize: (object) => normalize(object, [mensaje]),
    denormalize: (object) => denormalize(object, [mensaje])
}