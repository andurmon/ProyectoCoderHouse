// File System y Random
// const {getProductos, escribirArchivo} = require('./persistencia/archivos');

const {options} = require("./persistencia/mySQL.db")
const knex = require('knex')(options);

const fs = require("fs");


class ApiClass{
	constructor(){ }

	async get(req, res){
        knex.from('productos').select("*")
            .then((pdtos) => {
                if (!pdtos.length) { res.send({"error" : 'No hay productos cargados'}); return}
                res.json(pdtos);
            })
            .catch((err)=>{
                res.send({"error" : err})
            })
    }
    
    async getById(req, res){
        knex.from('productos').select("*").where("id", "=", req.params.id)
            .then((pdtos) => {
                if (!pdtos.length) { res.send({"error" :  `producto ${req.params.id} no encontrado`}); return}
                res.json(pdtos);
            })
            .catch((err)=>{
                res.send({"error" : err})
            })
	}

	async post(req, res){
        let newProduct = req.body;

        knex.from('productos').select("*")
            .then((pdtos) => {
                if (pdtos.length) {
                    let ids = pdtos.map(product => product.id )
                    newProduct.id = Math.max(...ids) + 1;
                }
                
                knex('productos').insert(newProduct)
            })
            .then (()=> res.send(newProduct))
            .catch(err=>  res.send({"error" : err}) )
    }

    async put(req, res){
        let productBody = req.body;

        knex.from("productos").where("id", req.params.id).update(productBody)
            .then(() => res.json(product))
            .catch(err=>  res.send({"error" : err}) )
    }

    async delete(req, res){
        let pdtoEliminado = {};
        knex.from('productos').select("*").where("id", "=", req.params.id)
            .then((pdtos) => {
                if (!pdtos.length) { res.send({"error" :  `producto ${req.params.id} no encontrado`}); return}
                pdtoEliminado = pdtos[0];
                knex.from("productos").where("id", req.params.id).del()
            })
            .then( () => res.send())
            .catch((err)=>{
                res.send({"error" : err})
            })
    }
}

module.exports = ApiClass;