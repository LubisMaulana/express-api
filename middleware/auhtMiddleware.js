const jwt = require('jsonwebtoken');
const APP_KEY = 'aku_ganteng_wak';

function verify(req, res, next){
    const barearHeader = req.headers['authorization'];

    if(typeof barearHeader === 'undefined'){
        return res.status(403).json({
            status: false,
            message: 'Access denied.'
        });
    }

    const token = barearHeader.split(' ')[1];

    jwt.verify(token, APP_KEY, (err, decoded) => {
        if(err){
            return res.status(401).json({
                status: true,
                message: 'Invalid or expired token'
            });
        }

        req.user = decoded;
        next();
    });
}

module.exports = verify;