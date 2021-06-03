const nodemailer = require('nodemailer')

const transporter = nodemailer.createTransport({
    host: 'smtp.ethereal.email',
    port: 587,
    auth: {
        user: 'keith68@ethereal.email',
        pass: 'H5jWgw2Z4ajVfXmmvX'
    }
});

module.exports = {
    enviarMail: (asunto, mensaje, callback) => {
        const mailOptions = {
            from: 'Servidor Node.js',
            to: 'keith68@ethereal.email',
            subject: asunto,
            html: mensaje
        }
        
        transporter.sendMail(mailOptions, (err, info) => callback(err,info) );
    }
}
