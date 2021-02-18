// File System y Random
const {getProductos, escribirArchivos} = require('./archivos/archivos');
const fs = require("fs");


class ApiClass{
	constructor(){ }

	async get(req, res){
        getProductos()
        .then( products => res.json(products))
        .catch(e => res.send(e));
    }
    
    async getById(req, res){
        getProductos()
        .then( products => {
            let product = products.find((product)=>product.id == req.params.id);
            if (!product) res.status(404).send({"error" : `producto ${req.params.id} no encontrado`});
            res.json(product);
        })
        .catch(e => res.send(e));
	}

	async post(req, res){
        let newProduct = req.body;

        getProductos()
        .then( products => {
            let ids = products.map(product => {
                return product.id;
            })
            newProduct.id = Math.max(...ids) + 1;
            products.push(newProduct);

            escribirArchivo(products);
            res.json(newProduct);
        })
        .catch(e => res.send(e));
    }

    async put(req, res){
        let productBody = req.body;

        getProductos()
        .then( products => {
            let product = products.find((product)=>product.id == req.params.id);
            if (!product) res.status(404).send({"error" : `producto ${req.params.id} no encontrado`});
    
            product.title = productBody.title;
            product.price = productBody.price;
            product.thumbnail = productBody.thumbnail;
            
            escribirArchivo(products);
            res.json(product)
        })
        .catch(e => res.send(e));
    }

    async delete(req, res){
        getProductos()
        .then( products => {
            let product = products.find((product)=>product.id == req.params.id);
            if (!product) res.status(404).send({"error" : `producto ${req.params.id} no encontrado`});

            let index = products.indexOf(product);
            products.splice(index, 1);

            escribirArchivo(products);
            res.send(product)
        })
        .catch(e => res.send(e));
    }
}

module.exports = ApiClass;