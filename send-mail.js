const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'Bell.Cranel9991@gmail.com',
        pass: 'ergn vcoq naex jiha'
    }
});

async function send_email(from, to, subject, text) {
    const mail = await transporter.sendMail({
        from: from,
        to: to,
        subject: subject,
        text: text
    });

    return mail;
}

module.exports = { send_email };