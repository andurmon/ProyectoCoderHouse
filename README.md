# Proyecto CoderHouse


## Persistencia

La persistencia tiene varias opciones, entre ellas: archivos, SQLITE, MySQL, MongoDB (local y atlas)
Para cambiar de uno a otro se deben editar los archivos:
* ./routes/productos.js Se debe modificar la ruta del crud a usar
* ./sockets/sockets.js Se debe modificar la ruta del modulo que contenga las funciones getChats y escribirArchivo
* ./routes/engine.js Se debe modificar la ruta del modulo que contenga las funciones getChats y escribirArchivo

### Nota:
* Deberia lograr que para cambiar la persistencia se pueda hacer solo desde el index.js. Debo buscar cuál es la mejor opción para lograrlo