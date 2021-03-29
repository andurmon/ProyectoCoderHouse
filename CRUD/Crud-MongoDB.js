const mongoose = require("mongoose")

//Conexion a la base de datos
let rutaBD = "mongodb://localhost/ecommerce"
// let rutaBD = "mongodb+srv://andurmon:admin@cluster0.4b6ca.mongodb.net/ecommerce?retryWrites=true&w=majority"

mongoose.connect(rutaBD, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(()=>console.log("Se conecto a la BD"))
    .catch((err)=>console.log("Error al conectarse a la BD: ", err))

const {Productos: Model} = require("../models/productos-model");

class CrudMongo{
	constructor(){ }

	async get(req, res){
        try{
            const docs = await Model.find();
            if (!docs.length) { return res.send({"error" : 'No hay productos cargados'});}
            res.send(docs)

        }catch(err){
			res.status(400).send({"error" : err});
        }
    }
    
    async getById(req, res){
        try{ 
			const document = await Model.findOne({_id: req.params.id});
			res.send(document);
		}
		catch(err){
			res.status(400).send({"error" :  `producto ${req.params.id} no encontrado`});
		}
	}

	async post(req, res){
        let newProduct = req.body;

        try{
			const newDocument = await new Model(newProduct);
			await newDocument.save(); 
			res.send(newDocument);    
		}
		catch(err){
			res.status(400).send({"error" : err});
		}
    }

    async put(req, res){
        let productBody = req.body;

        try{ 
			const document = await Model.findOneAndUpdate({_id: req.params.id}, productBody);
			if(!document) return res.status(404).send({"error" :  `producto ${req.params.id} no encontrado`});
			res.send(document);
		}
		catch(err){
			res.status(400).send({"error" : err});
		}
    }

    async delete(req, res){
        let pdtoEliminado = {};

        try{ 
			pdtoEliminado = await Model.deleteOne({_id: req.params.id});
			if(!pdtoEliminado) return res.status(404).send({"error" :  `producto ${req.params.id} no encontrado`});
			res.send(pdtoEliminado);
		}
		catch(err){
			res.status(400).send({"error" : err.message});
		}
    }
}

module.exports = CrudMongo;