const {getProductos} = require('../archivos/archivos');

function engine(req, res){
    getProductos()
        .then( products => {
            res.render('partials/fila', {products: products})
        })
        .catch(error => {
            console.log("Error: ", error);
            res.render('partials/notfound', error)
        });
}

async function engineEJS(req, res){
    let data = {isOk: false, products: [], error:""};
    await getProductos()
        .then( products => {
            data = {isOk: true, products: products, error:""};
        })
        .catch(error => {
            console.log("Error: ", error);
            data = {isOk: false, products: [], error: error};
        });
    res.render('layouts/index', data)
}

module.exports = {
    engine: engine,
    engineEJS: engineEJS
}