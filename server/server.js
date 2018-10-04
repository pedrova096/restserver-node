require('./config/config');

const mongoose = require('mongoose');
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const path = require('path');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

//Configuracion de las rutas globales
app.use(require('./routes/index.js'));
app.use(express.static(path.resolve(__dirname, '../public')));


mongoose.connect(process.env.URLDB, (err, res) => {
    if (err) throw err;
    console.log('Conectado a DB mongo');
});

app.listen(process.env.PORT, () => {
    console.log('Escuchando puerto: ', process.env.PORT);
});