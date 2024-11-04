const nodemailer = require('nodemailer')
// const hbs = require('nodemailer-express-handlebars')
const path = require('path')

const sendEmail = async (subject, sendTo, sendFrom, replyTo, template, name, link) => {
    // Create Email Transporter
    const transporter = nodemailer.createTransport({
        host: process.env.EMAIL_HOST_MAILJET,
        port: 587,
        auth: {
            user: process.env.EMAIL_USER_MAILJET,
            pass: process.env.EMAIL_PASS_MAILJET,
        },
        // tls: {
        //     rejectUnauthorized: false
        // }
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

    // transporter.use('compile', hbs(handlerOptions));

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

    // console.log('send email')
    // try {
    //     const info = await transporter.sendMail(options);
    //     console.log('info : ', info);
    // } catch (err) {
    //     console.log(err);
    //     throw new Error('Failed to send email');
    // }

}


module.exports = sendEmail;