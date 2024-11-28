const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

dotenv.config();


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.email_address,
        pass: process.env.google_app_password
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