
const options = {
    client: 'mysql',
    connection: {
        host : '192.168.1.50',
        user : 'root',
        password : 'admin',
        database : 'prueba'
    },
    pool: {min: 0, max:10}
}

const optionsSQLITE = {
    client: 'sqlite3',
    connection: {filename: "./data/chats.sqlite"},
    useNullAsDefault: true,
    pool: {min: 0, max:10}
}

module.exports = {
    options: options,
    optionsSQLITE: optionsSQLITE
}