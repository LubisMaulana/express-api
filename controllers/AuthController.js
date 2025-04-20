const jwt = require('jsonwebtoken');
const conn = require('../config/database');
const passwordHash = require('password-hash');

const APP_KEY = 'aku_ganteng_wak';

class AuthController{
    static login(req, res){
        const { email, password } = req.body;

        conn.query('SELECT id, email, password FROM users WHERE email = ?', [email], function(err, rows){
            if(err){
                return res.status(500).json({
                    status: false,
                    message: 'Internal Server Error'
                });
            }

            if(rows.length == 0){
                return res.status(401).json({
                    status: false,
                    message: 'Email not registered'
                });
            }

            const user = rows[0];
            const isPasswordValid = passwordHash.verify(password, user.password);

            if(!isPasswordValid){
                return res.status(401).json({
                    status: false,
                    message: 'Incorrect password'
                });
            }

            const token = jwt.sign({
                id: user.id,
                email: user.password,
                password: user.password,
            }, APP_KEY, {expiresIn: '2h'});

            return res.status(200).json({
                status: true,
                message: 'Login Successful!',
                token
            });
        })
    }
}

module.exports = AuthController;