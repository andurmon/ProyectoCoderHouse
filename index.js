const PORT = process.env.PORT || 8080;

const express = require("express");
const ApiClass = require("./ApiModule");
const app = express();
const handlebars = require('express-handlebars');
const fs = require("fs");

const productos = require("./routes/productos")

app.use(express.json());
app.use(express.urlencoded({extended:true}));

app.use("/api/products", productos);

app.set("views", "./views");
app.engine("hbs",
    handlebars({
        extname:".hbs",
        defaultLayout:"index.hbs",
        layoutsDir:__dirname+"/views/layouts/",
        partialsDir:__dirname +"/views/partials/"
    })
)
app.set("view engine", "hbs");

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


app.get('/engine', (req, res)=>{
    getProductos()
        .then( products => {
            res.render('partials/fila', {products: products})
        })
        .catch(error => {
            console.log("Error: ", error);
            res.render('partials/notfound', error)
        });
})

app.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});