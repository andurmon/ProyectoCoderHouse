const PORT = process.env.PORT || 8080;

const express = require("express");
const app = express();
const handlebars = require('express-handlebars');

const productos = require("./routes/productos")
const {engine, engineEJS} = require("./routes/engine");

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Configurando Template Engines
app.set("views", "./views");

// ======= Handlebars =====
// app.set("view engine", "hbs");
// app.engine("hbs",
//     handlebars({
//         extname:".hbs",
//         defaultLayout:"index.hbs",
//         layoutsDir:__dirname+"/views/layouts/",
//         partialsDir:__dirname +"/views/partials/"
//     })
// )

// ========= Pug ===========
// app.set('view engine', 'pug');

// ========= Ejs ===========
app.set("view engine", "ejs")
app.get('/productos/vista', engineEJS);

//Rutas
// app.get('/productos/vista', engine);
app.use("/api/products", productos);

app.listen(PORT, ()=>{
    console.log(`Escuchando en el Puerto: ${PORT}`);
});