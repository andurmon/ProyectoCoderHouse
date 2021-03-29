const {optionsSQLITE} = require("./mySQL.db")
const knex = require('knex')(optionsSQLITE);

try {
    knex.schema.createTable('chats', table =>{
        table.string('sender');
        table.string('time', 20)
        table.string('message');
    })
    .then(() => console.log("Se creo la tabla chats"))
    .catch( e => console.log(e.code))

    knex.schema.createTable('productos', table =>{
        table.increments("id").primary();
        table.string('title', 20);
        table.integer('price').unsigned().notNullable();
        table.string('thumbnail');
    })
    .then(() => console.log("Se creo la tabla Productos"))
    .catch( e => console.log(e.code))

} catch (error) {
    console.log("MySQL init error: ", error);
}

function getChats() { return knex.from('chats').select("*") }

function escribirChat(chat){ return knex('chats').insert(chat);}

module.exports = {
    getChats: getChats,
    escribirChat: escribirChat
}