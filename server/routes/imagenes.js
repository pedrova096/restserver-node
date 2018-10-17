const express = require('express');
const app = express();
const fs = require('fs');
const path = require('path');
const { verificaTokenImg } = require('../middlewares/autenticacion');
app.get('/img/:tipo/:img', [verificaTokenImg], function(req, res) {
    let tipo = req.params.tipo;
    let img = req.params.img;

    let rutaImg = path.resolve(__dirname, `../../uploads/${tipo}/${img}`);
    let defaultImg = path.resolve(__dirname, '../assets/no-image.jpg')

    if (fs.existsSync(rutaImg)) {
        res.sendFile(rutaImg);
    } else {
        res.sendFile(defaultImg);
    }
});

module.exports = app;