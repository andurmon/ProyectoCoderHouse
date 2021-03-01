const fs = require("fs");
const rutaProductos = "./data/productos.txt";

function getProductos(){
    return new Promise((resolve, reject)=>{
        fs.promises.readFile(rutaProductos, 'utf-8')
            .then((prods)=>{
                var products = JSON.parse(prods);
                if (!products.length) reject({"error" : 'No hay productos cargados'});
                resolve(products)
            }).catch((error)=>{
                reject({"error": error})
            })
    })
}

function escribirArchivo(productos){
    fs.promises.writeFile(rutaProductos, JSON.stringify(productos));
}

const rutaChats = "./data/group-chat.txt";
function getChats(){
    return new Promise((resolve, reject)=>{
        fs.promises.readFile(rutaChats, 'utf-8')
            .then((chat)=>{
                var messages = JSON.parse(chat);
                if (!messages.length) resolve([]);
                resolve(messages)
            }).catch((error)=>{
                reject({"error": error})
            })
    })
}

function escribirChat(chat){
    fs.promises.writeFile(rutaChats, JSON.stringify(chat));
}

module.exports = {
    rutaProductos: rutaProductos,
    getProductos: getProductos,
    escribirArchivo: escribirArchivo,
    getChats: getChats,
    escribirChat: escribirChat
}