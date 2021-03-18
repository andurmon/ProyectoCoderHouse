const {optionsSQLITE} = require("../persistencia/mySQL.db");
const knex = require('knex')(optionsSQLITE);

function engine(req, res){
    knex.from('productos').select("*")
        .then((pdtos) => {
            res.render('partials/tabla', {products: pdtos})
        })
        .catch((error)=>{
            console.log("Error: ", error);
            res.render('partials/notfound', error)
        })
}

module.exports = engine;
