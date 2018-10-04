const express = require('express');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const app = express();
const Usuario = require('../models/usuario');
const { verificaToken, verificaADMIN_ROLE } = require('../middlewares/autenticacion');

app.get('/usuario', verificaToken, function(req, res) {
    let desde = req.query.desde || 0;
    let limite = req.query.limite || 5;
    limite = Number(limite);
    desde = Number(desde);

    let valEstado = {
        estado: true
    }

    Usuario.find(valEstado, 'nombre email google')
        .skip(desde) //Desde del primer registro salta 
        .limit(limite)
        .exec((err, usuarios) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }
            Usuario.count(valEstado, (err, conteo) => {
                res.json({
                    ok: true,
                    usuarios,
                    conteo
                });
            });
        });
});
//Crear
app.post('/usuario', [verificaToken, verificaADMIN_ROLE], function(req, res) {
    let body = req.body;
    let usuario = new Usuario({
        nombre: body.nombre,
        email: body.email,
        password: bcrypt.hashSync(body.password, 10),
        role: body.role
    });
    usuario.save((err, usuDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        // usuDb.password = null
        res.json({
            ok: true,
            usuario: usuDb
        });
    });
});
//Actualizar
app.put('/usuario/:id', [verificaToken, verificaADMIN_ROLE], function(req, res) {
    let id = req.params.id;
    let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
    /*Usuario.findById(id, (err, usuDb) => {

    });*/
    Usuario.findByIdAndUpdate(id, body, {
        new: true,
        runValidators: true
    }, (err, usuDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        res.json({
            ok: true,
            usuario: usuDb
        });
    });
});

app.delete('/usuario/:id', [verificaToken, verificaADMIN_ROLE], function(req, res) {
    let id = req.params.id;
    Usuario.findByIdAndUpdate(id, { estado: false }, { new: true }, (err, usuDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        } else if (!usuDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuDb
        });
    });
    /*Usuario.findByIdAndRemove(id, (err, usuDb) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }
        if (!usuDb) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: "Usuario no encontrado"
                }
            })
        }
        res.json({
            ok: true,
            usuario: usuDb
        });
    });*/
});

module.exports = app;