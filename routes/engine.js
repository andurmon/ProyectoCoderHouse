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

module.exports = engine;
