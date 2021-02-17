const express = require("express");
const router = express.Router();

const ApiClass = require("../ApiModule");
let api = new ApiClass();

router.get('/', api.get);
router.get('/:id', api.getById);
router.post('/', api.post);
router.put('/actualizar/:id', api.put);
router.delete('/borrar/:id', api.delete);

module.exports = router;