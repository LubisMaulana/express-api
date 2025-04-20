const express = require('express');
const {body} = require('express-validator');
const route = express.Router();
const UserController = require('../controllers/UserController');
const verify = require('../middleware/auhtMiddleware');

route.get('/', verify, UserController.getUsers);

route.get('/:id', verify, UserController.getUserById);

route.post('/store', [
    body('nama').notEmpty().withMessage('Nama wajib diisi'),
    body('email').isEmail().withMessage('Email tidak valid'),
    body('no_hp').isLength({ min: 10 }).withMessage('Nomor HP minimal 10 digit'),
    body('jenis_kelamin').isIn(['Laki-laki', 'Perempuan']).withMessage('Jenis kelamin harus Laki-laki atau Perempuan'),
    body('tgl_lahir').isDate().withMessage('Tanggal lahir tidak valid'),
    body('password').isLength({ min: 8 }).withMessage('Password minimal 8 digit'),
], verify, UserController.addUser);

route.patch('/update/:id', [
    body('nama').optional().notEmpty().withMessage('Nama wajib diisi'),
    body('email').optional().isEmail().withMessage('Email tidak valid'),
    body('no_hp').optional().isLength({ min: 10 }).withMessage('Nomor HP minimal 10 digit'),
    body('jenis_kelamin').optional().isIn(['Laki-laki', 'Perempuan']).withMessage('Jenis kelamin harus Laki-laki atau Perempuan'),
    body('tgl_lahir').optional().isDate().withMessage('Tanggal lahir tidak valid'),
    body('password').optional().isLength({ min: 8 }).withMessage('Password minimal 8 digit'),
], verify, UserController.updateUser);

route.delete('/delete/:id', verify, UserController.deleteUser);

module.exports = route;