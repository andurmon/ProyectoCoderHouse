const router = require("express").Router();

let Crud;
// Crud = require("../CRUD/Crud-SQLITE");
Crud = require("../CRUD/Crud-MongoDB");

let api = new Crud();

router.get('/', api.get);
router.get('/:id', api.getById);
router.post('/', api.post);
router.put('/actualizar/:id', api.put);
router.delete('/borrar/:id', api.delete);

module.exports =  router;