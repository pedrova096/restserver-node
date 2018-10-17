const jwt = require('jsonwebtoken');

let verificaToken = (req, res, next) => {
    let token = req.get('token'); //autoritation
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

let verificaTokenImg = (req, res, next) => {
    let token = req.query.token; //autoritation
    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err
            });
        }
        req.usuario = decoded.usuario;
        next();
    });
};

let verificaADMIN_ROLE = (req, res, next) => {
    if (req.usuario.role == 'ADMIN_ROLE') {
        next();
    } else {
        return res.status(401).json({
            ok: false,
            err: {
                message: 'El usuario no es Administrador'
            }
        });
    }
}
module.exports = {
    verificaToken,
    verificaADMIN_ROLE,
    verificaTokenImg
}