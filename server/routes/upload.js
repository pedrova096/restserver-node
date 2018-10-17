const express = require('express');
const fileUpload = require('express-fileupload');
const app = express();

const Usuario = require('../models/usuario');
const Producto = require('../models/producto');

const fs = require('fs');
const path = require('path');
//subida por defecto
app.use(fileUpload());

app.put('/upload/:tipo/:id', [], function(req, res) {
    let tipo = req.params.tipo;
    let id = req.params.id;
    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No se ha seleccionado ningun archivo'
            }
        });
    }

    let tipoValido = ['producto', 'usuario'];
    if (!tipoValido.includes(tipo)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Tipo no permitido'
            }
        });
    }

    let sampleFile = req.files.archivo;
    //Extenciones permitidas
    let extens = ['png', 'jpg', 'gif', 'jpeg'];
    let nombreCorto = sampleFile.name.split('.');
    let FileExtencion = nombreCorto[nombreCorto.length - 1];
    if (!extens.includes(FileExtencion)) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Las extenciones permitidas son: ' + extens.join(', '),
                ext: FileExtencion
            }
        });
    }

    let FileNewName = `${id}-${new Date().getMilliseconds()}.${FileExtencion}`;

    sampleFile.mv(`./uploads/${tipo}/${FileNewName}`, (err) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        /*BORRAR
        return res.json({
            ok: true,
            message: 'Archivo subido existosamente'
        });*/
        if (tipo === 'usuario') {
            ImagenUsuario(id, res, FileNewName);
        } else {
            ImagenProducto(id, res, FileNewName);
        }
    })
});

function ImagenUsuario(id, res, nameFile) {
    Usuario.findById(id, (err, usuDB) => {
        if (err) {
            borrarImg(nameFile, 'usuario');
            return res.status(500).json({
                ok: false,
                err
            });
        } else if (!usuDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Usuario no existe'
                }
            });
        }

        borrarImg(usuDB.img, 'usuario');

        usuDB.img = nameFile;

        usuDB.save((err, UsuSAVE) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                usuario: UsuSAVE,
                img: nameFile
            });
        });
    });
}

function ImagenProducto(id, res, fileName) {
    Producto.findById(id, (err, prodDB) => {
        if (err) {
            borrarImg(fileName, 'producto');
            return res.status(500).json({
                ok: false,
                err
            });
        } else if (!prodDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'producto no existe'
                }
            });
        }

        borrarImg(prodDB.img, 'producto');

        prodDB.img = fileName;

        prodDB.save((err, prodSAVE) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                producto: prodSAVE,
                img: fileName
            });
        });
    });
}

function borrarImg(nombreImg, tipo) {
    let rutaImg = path.resolve(__dirname, `../../uploads/${tipo}/${nombreImg}`);
    if (fs.existsSync(rutaImg)) {
        fs.unlinkSync(rutaImg);
    }
}


module.exports = app;