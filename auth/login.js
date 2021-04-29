const { Users } = require("../models/users-model");

const login = (req, res) => {
    Users.findOne({email: req.body.email})
        .then(u => {
            console.log(u);
            if (!u){
                res.status(401).send("Not logged in");
                return;
            }
            req.session.username = u.nombre;
            req.session.email = u.email;
            req.session.loggedIn = true;
            res.send("Logged in");
        })
        .catch(e => {
            console.log(e);
            res.status(500).send("Error de servidor");
        }) 
}

module.exports = {
    login
}