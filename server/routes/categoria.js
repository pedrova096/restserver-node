const express = require('express');
const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');
const app = express();
const Categoria = require('../models/categoria');


//Obtiene todas las categorias
app.get('/categoria', [verificaToken], function(req, res) {
    /*let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);*/
    Categoria.find({})
        .populate('usuario', 'nombre email')
        .sort('descripcion')
        .exec((err, categorias) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Categoria.count({}, (err, conteo) => {
                res.json({
                    ok: true,
                    categorias,
                    conteo
                });
            });
        });
});

//Obtener categoria por ID
app.get('/categoria/:id', [verificaToken], function(req, res) {
    let id = req.params.id;
    Categoria.findById(id, (err, catDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (!catDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Categoria no encontrada"
                }
            })
        }
        return res.json({
            ok: true,
            categoria: catDB
        });

    });
});

//Crear Categoria
app.post('/categoria', [verificaToken], function(req, res) {
    let descripcion = req.body.descripcion;
    let id = req.usuario._id;
    let categoria = new Categoria({
        descripcion,
        usuario: id
    });
    categoria.save((err, catDB) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        return res.json({
            ok: true,
            categoria: catDB
        });
    });
});
//Actualizar nombre
app.put('/categoria/:id', [verificaToken], function(req, res) {
    let id = req.params.id;
    let descripcion = req.body.descripcion;
    Categoria.findByIdAndUpdate(id, { descripcion }, { new: true, runValidators: true },
        (err, catDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else if (!catDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoria no encontrada"
                    }
                })
            }
            res.json({
                ok: true,
                categoria: catDB
            });
        });
});

app.delete('/categoria/:id', [verificaToken, verificaADMIN_ROLE],
    function(req, res) {
        let id = req.params.id;
        Categoria.findByIdAndRemove(id, (err, catDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else if (!catDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Categoria no encontrada"
                    }
                })
            }
            res.json({
                ok: true,
                categoria: catDB
            });
        });
    });

module.exports = app;