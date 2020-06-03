const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SG_API)

const sendWelcomeEmail = (email, name) => {
    sgMail.send(
        {
            to: email,
            from: 'tyudosen@gmail.com',
            subject: 'Welcome!',
            text: `${name}, Thank you for using the app.`
        }
    )
}

const sendFarewellEmail = (email,name) => {
    sgMail.send(
        {
            to: email,
            from: 'tyudosen@gmail.com',
            subject: 'Goodbye :(',
            text: `We hate to see you go ${name}. What could we have done different ?`
        }
    )
}

module.exports = {
    sendWelcomeEmail,
    sendFarewellEmail
}