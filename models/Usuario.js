'use strict'

const mongoose = require('mongoose')
const Schema = mongoose.Schema
const bcrypt = require('bcrypt-nodejs')
const crypto = require('crypto')

const UsuarioSchema = new Schema({


  numeroDocumento: { type: Number, unique: true, lowercase: true },
  lugarExpedicion: { type: String },
  fechaExpedicion: { type: Date },
  fechaNacimiento: { type: Date },
  genero: { type: String, enum: ['MASCULINO', 'FEMENINO', 'OTRO'] },
  nombreEmpresa: { type: String },
  nombre: { type: String },
  usuario: { type: String },
  apellidos: { type: String },
  email: { type: String, unique: true, lowercase: true },
  password: { type: String, select: false },
  numeroTelefono: {type: Number},
  direccion: { type : String},
  ocupacion: { type: String },
  cargo: { type: String, enum: ['LECTOR', 'COORDINADOR', 'SUPERVISOR', 'TECNICO CARGUE Y DESCARGUE'] },
  centroTrabajo: { type: String },
  signupDate: { type: Date, default: Date.now() },
  lastLogin: { type: Date },
  imgPerfil:{type:String}

})

UsuarioSchema.pre('save', (next) => {
  let user = this
  //if (!user.isModified('password')) return next()

  bcrypt.genSalt(12, (err, salt) => {
    if (err) return next(err)

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err)

      user.password = hash
      next()
    })
  })
})

UsuarioSchema.methods.gravatar = function () {
  if (!this.email) return `https://gravatar.com/avatar/?s=200&d=retro`

  const md5 = crypto.createHash('md5').update(this.email).digest('hex')
  return `https://gravatar.com/avatar/${md5}?s=200&d=retro`
}

module.exports = mongoose.model('User', UsuarioSchema)
