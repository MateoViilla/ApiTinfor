
'use strict'

const User = require('../models/Usuario');
const service = require('../services')
const crypto = require('../crypto')



function guardarUsuario(req, res) {

    const user = new User({
        numeroDocumento: req.body.numeroDocumento,
        lugarExpedicion: req.body.lugarExpedicion,
        fechaExpedicion: req.body.fechaExpedicion,
        fechaNacimiento: req.body.fechaNacimiento,
        genero: req.body.genero,
        nombreEmpresa: req.body.nombreEmpresa,
        nombre: req.body.nombre,
        usuario: req.body.nombre,
        apellidos: req.body.apellidos,
        email: req.body.email,
        numeroTelefono: req.body.numeroTelefono,
        ocupacion: req.body.ocupacion,
        cargo: req.body.cargo,
        centroTrabajo: req.body.centroTrabajo,
        password: req.body.password,
        direccion: req.body.direccion
        //lastLogin: req.body.lastLogin
    })

    User.findOne({ numeroDocumento: req.body.numeroDocumento }, (err, usuarioExistente) => {
        if (err) return res.send({ message: err });
        if (usuarioExistente) {
            return res.send({ message: "Usuario ya registrado" });
        }
        user.save((err) => {
            if (err) return res.status(500).send({ message: `Error al crear el usuario: ${err}` })

            //            return res.status(201).send({ token: service.createToken(user) })
            return res.status(201).send({ usuario: user })
        })
    })
}

function logIn(req, res) {
    let numeroDocumento = req.body.numeroDocumento;
    //let password = crypto.desencryptar(req.body.password)
    //User.findOne( {numeroDocumento,password}, (err, user) => {
    User.findOne({ numeroDocumento }, (err, user) => {
        if (err) return res.status(500).send({ message: err })
        if (!user) return res.status(404).send({ message: 'No existe el usuario' })

        res.status(200).send({
            message: 'Te has logueado correctamente',
            token: service.createToken(user),
            user
        })
    })

}

function obtenerUsuarios(req, res) {
    User.find({}, (err, users) => {
        if (err) return res.send({ "OK": 0, "Mensaje": 'Error al realizar la peticion' });
        if (!users[0]) return res.send({ "OK": 0, "Mensaje": 'No hay usuarios' });
        res.send({ message: users });
    });
}

function obtenerUsuario(req, res) {
    let numeroDocumento = req.param.numeroDocumento;

    User.findOne(numeroDocumento, (err, user) => {
        if (err) return res.send({ message: 'Error al realizar la peticion' });
        if (!user) return res.send({ message: 'El usuario no existe' });
        return res.send(user);
    })
}

function modificarUsuario(req, res) {
    let numeroDocumento = req.body.numeroDocumento;
    let update = req.body;

    User.findOneAndUpdate({ "numeroDocumento": numeroDocumento }, update, (err, userUpdated) => {
        if (!userUpdated) return res.send({ message: "El usuario no existe" });
        if (err) return res.send({ message: "Error al actualizar el usuario: ${err}`" });
        return res.send({ message: "Modificado con éxito" });
    })
}

function eliminarUsuario(req, res) {
    let numeroDocumento = req.body.numeroDocumento;
    User.findOne(numeroDocumento, (err, user) => {
        if (err) res.status(500).send({ message: `Error al eliminar el usuario: ${err}` })
        if (!user) res.send({ message: `No se encontro el usario a elminar` });
        user.remove(err => {
            if (err) res.status(500).send({ message: "No fue posible eliminar en la BD. Intente nuevamente o consulte al admimnistrador." });
            res.status(200).send({ message: "Eliminado con éxito" });

        });
    });
}


module.exports = {
    obtenerUsuario,
    guardarUsuario,
    obtenerUsuarios,
    modificarUsuario,
    eliminarUsuario,
    logIn
}