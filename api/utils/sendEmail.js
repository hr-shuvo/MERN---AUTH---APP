const nodemailer = require('nodemailer')
// const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const sendEmail = async (subject, sendTo, sendFrom, replyTo, template, name, link) => {
    const {default: hbs} = await import('nodemailer-express-handlebars');

    // Create Email Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST_MAILJET,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER_MAILJET,
            pass: process.env.EMAIL_PASS_MAILJET,
        },
        tls: {
            rejectUnauthorized: false
        }
    });

    const handlerOptions = {
        viewEngine: {
            extName: '.handlebars',
            partialsDir: path.resolve('./views'),
            defaultLayout: false
        },
        viewPath: path.resolve('./views'),
        extName: '.handlebars',
    };

    transporter.use('compile', hbs(handlerOptions));

    // Options for sending email
    const options = {
        from: sendFrom,
        to: sendTo,
        replyTo: replyTo,
        subject: subject,
        template: template,
        context: {
            name,
            link
        }
    };

    // Send Email
    await transporter.sendMail(options, function (err, info) {
        if (err) {
            console.log(err)
        } else {
            console.log('Email sent:', info)
        }
    })

}


module.exports = sendEmail;