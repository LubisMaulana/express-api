const { v4: uuidv4 } = require('uuid');
const passwordHash = require('password-hash');
const {validationResult} = require('express-validator');
const conn = require('../config/database');

class UserController{
    static getUsers(_, res){
        conn.query('SELECT id, nama, email, no_hp, jenis_kelamin, tgl_lahir FROM users ORDER BY created_at DESC', function(err, rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error'
                });
            } else{
                return res.status(200).json({
                    status: true,
                    message: 'List Data Users',
                    data: rows
                })
            }
        });
    }

    static getUserById(req, res){
        const id = req.params.id;

        conn.query('SELECT id, nama, email, no_hp, jenis_kelamin, tgl_lahir FROM users WHERE id = ?', [id], function(err, rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error'
                });
            }

            if(rows.length <= 0){
                return res.status(404).json({
                    status: false,
                    message: 'Data User Not Found!'
                });
            }else{
                return res.status(200).json({
                    status: true,
                    message: 'Detail Data User',
                    data: rows[0]
                });
            }
        })
    }

    static addUser(req, res) {
        const errors = validationResult(req);
    
        if(!errors.isEmpty()){
            return res.status(422).json({
                errors: errors.array()
            });
        }
    
        const formData = {
            id: uuidv4(),
            nama: req.body.nama,
            email: req.body.email,
            no_hp: req.body.no_hp,
            jenis_kelamin: req.body.jenis_kelamin,
            tgl_lahir: req.body.tgl_lahir,
            password : passwordHash.generate(req.body.password),
            created_at: new Date(),
            updated_at: new Date()
        };
    
        conn.query('INSERT INTO users SET ?', formData, function(err, rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error'
                });
            }else{
                return res.status(201).json({
                    status: true,
                    message: 'Insert Data Successfully',
                    data: rows[0]
                });
            }
        });
    }

    static updateUser(req, res){
        const id = req.params.id;
        const errors = validationResult(req);
    
        if(!errors.isEmpty()){
            return res.status(422).json({
                errors: errors.array()
            });
        }
    
        const keysData = ['nama', 'email', 'no_hp', 'jenis_kelamin', 'tgl_lahir'];
        const formData = {};
    
        keysData.forEach(key => {
            if(req.body[key] !== undefined) formData[key] = req.body[key];
        });
    
        if(req.body.password !== undefined) formData.password = passwordHash.generate(req.body.password);
        formData.updated_at = new Date();
    
        conn.query('UPDATE users SET ? WHERE id = ?', [formData, id], function(err, rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error'
                });
            }else{
                return res.status(200).json({
                    status: true,
                    message: 'Update User Successfully!',
                    data: rows[0]
                })
            }
        });
    }

    static deleteUser(req, res){
        const id = req.params.id;
    
        conn.query('DELETE FROM users WHERE id = ?', [id], function(err, _){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Server Internal Server'
                });
            }else{
                return res.status(500).json({
                    status: true,
                    message: 'Delete User Successfully!'
                });
            }
        });
    }
}

module.exports = UserController;