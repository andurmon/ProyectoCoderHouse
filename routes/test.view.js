const faker = require("faker")
const router = require("express").Router();

function fakeData(num){
    let productos = []

    for(let i=0; i<num; i++){
        productos.push({
            title: faker.random.words(3),//faker.name.title(),
            price: faker.datatype.number(),
            thumbnail: faker.random.image()
        })
    }

    return {isOk: true, products: productos, error:""};
}

router.get('/', (req, res) => {
    res.render('layouts/test_view', fakeData(10))

});

router.get('/:num', (req, res) => {
    res.render('layouts/test_view', fakeData(req.params.num))

});

module.exports = router;