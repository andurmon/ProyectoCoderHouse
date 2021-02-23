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

module.exports = {
    rutaProductos: rutaProductos,
    getProductos: getProductos,
    escribirArchivo: escribirArchivo
}