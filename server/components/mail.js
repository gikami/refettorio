const nodemailer = require("nodemailer");
class Mail {
    async send(text, clientEmail) {
        if (text && text.length > 0) {
            // create reusable transporter object using the default SMTP transport
            let transporter = nodemailer.createTransport({
                host: "smtp.yandex.ru",
                port: 465,
                secure: true, // true for 465, false for other ports
                auth: {
                    user: 'asmkontekst@yandex.ru', // generated ethereal user
                    pass: 'rsjbyloenrpsvntr', // generated ethereal password
                },
            })
            // send mail with defined transport object
            if (clientEmail && clientEmail.length > 0) {
                var info = await transporter.sendMail({
                    from: '"Заявка с сайта Refettorio" <asmkontekst@yandex.ru>', // sender address
                    to: clientEmail, // list of receivers
                    subject: "Ваш заказ на сайте Refettorio",
                    html: text, // html body
                })
            } else {
                var info = await transporter.sendMail({
                    from: '"Заявка с сайта Refettorio" <asmkontekst@yandex.ru>', // sender address
                    to: "Refetorio@yandex.ru,asmkontekst@yandex.ru", // list of receivers
                    subject: "Заявка с сайта Refettorio",
                    html: text, // html body
                })
            }
            if (info) {
                return true
            } else {
                return false
            }
        } else {
            return false
        }
    }
}
module.exports = new Mail()