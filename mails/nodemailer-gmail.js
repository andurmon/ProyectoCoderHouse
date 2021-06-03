const nodemailer = require('nodemailer');
require("dotenv").config();

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.MAIL,
        pass: process.env.PW
    }
});

module.exports = { 
    enviarMail: (asunto, mensaje, adjunto, to, callback) => {
        const mailOptions = {
            from: 'Servidor Node.js',
            to: to,
            subject: asunto,
            html: mensaje,
            attachments: [
                {
                    path: adjunto,
                    filename: 'foto.jpg',
                }
            ]        
        }
        
        transporter.sendMail(mailOptions, (err, info) => {
            callback(err,info)
        })
    }
}
