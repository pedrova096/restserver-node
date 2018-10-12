const express = require('express');
const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');
const app = express();
const Producto = require('../models/producto');
const _ = require('underscore');
//obtener todos los productos con paginación
app.get('/productos', [verificaToken], function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    let condicion = { disponible: true };
    limite = Number(limite);
    desde = Number(desde);
    Producto.find(condicion)
        .skip(desde)
        .limit(limite)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Producto.count(condicion, (err, conteo) => {
                res.json({
                    ok: true,
                    productos,
                    conteo
                });
            });
        });
});
//Obtener producto por ID
app.get('/producto/:id', [verificaToken], function(req, res) {
    let id = req.params.id;
    Producto.findById(id)
        .populate('categoria', 'descripcion')
        .populate('usuario', 'nombre email')
        .exec((err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'No existe producto con ese ID'
                    }
                });
            }
            return res.json({
                ok: true,
                producto: productoDB
            });
        });
});
//Buscar productos
app.get('/producto/buscar/:termino', [verificaToken], function(req, res) {
    let termino = req.params.termino;
    let regex = new RegExp(termino, 'i');
    Producto.find({ nombre: regex })
        .populate('categoria', 'descripcion')
        .sort('nombre')
        .exec((err, productos) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            return res.json({
                ok: true,
                productos
            });
        });
});


//Crea un nuevo producto
app.post('/producto', [verificaToken], function(req, res) {
    let body = req.body;
    let producto = new Producto({
        usuario: req.usuario._id,
        nombre: body.nombre,
        precioUni: Number(body.precioUni),
        descripcion: body.descripcion,
        disponible: body.disponible,
        categoria: body.categoria
    });
    producto.save((err, productoDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            });
        }
        return res.status(201).json({
            ok: true,
            producto: productoDB
        });
    });
});
//Actualizar productos por ID
app.put('/producto/:id', [verificaToken], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'precioUni', 'descripcion', 'disponible', 'categoria', 'usuario']);
    Producto.findByIdAndUpdate(id, body, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(500).json({
                    ok: false,
                    err
                });
            } else if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Error no valido"
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB
            });
        });
});
//Eliminar 
app.delete('/producto/:id', [verificaToken, verificaADMIN_ROLE], function(req, res) {
    let id = req.params.id;
    let disponible = false;
    Producto.findByIdAndUpdate(id, { disponible }, { new: true, runValidators: true },
        (err, productoDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            } else if (!productoDB) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: "Producto no encontrado"
                    }
                });
            }
            res.json({
                ok: true,
                producto: productoDB,
                message: "Producto borrado"
            });
        });
});

module.exports = app;