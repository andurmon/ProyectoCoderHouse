// const {getProductos} = require("../persistencia/archivos.js");
// const {getProductos} = require("../persistencia/mysql.js");
const {getProductos} = require("../persistencia/mongodb.js");
require("dotenv").config()

function engineHbs(req, res){
    getProductos()
        .then((pdtos) => {
            console.log("pdtos: ", pdtos)
            res.render('partials/tabla', { url: process.env.SERVER_URL, products: pdtos})
        })
        .catch((error)=>{
            console.log("Error: ", error);
            res.render('partials/notfound', error)
        })
}

async function engineEJS(req, res){
    let data = { url: process.env.SERVER_URL, isOk: false, username: null, products: [], error:"No se ha cargado" };
    await getProductos()
        .then( products => {
            data = { url: process.env.SERVER_URL, isOk: true, username: req.session.username, email: req.session.email, products: products, error:""};
        })
        .catch(error => {
            console.log("Error: ", error);
            data = { url: process.env.SERVER_URL, isOk: false, username: null, products: [], error: error};
        })
        .finally(() => {
            res.render('layouts/index', data)
        })
}

module.exports = {
    engineEJS: engineEJS
}
