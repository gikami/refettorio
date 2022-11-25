require('dotenv').config()
const express = require('express')
const sequelize = require('./db')
const { Op, User, Notification, Order } = require('./models/models')
const NotificationsPush = require('./components/pushNotifications')
const nodeCron = require("node-cron");
const cors = require('cors')
const https = require('https')
//const http = require('http')
const fs = require('fs');
const fileUpload = require('express-fileupload')
const router = require('./routes/index')
const errorHandler = require('./middleware/ErrorHandlingMiddleware')
const path = require('path')
const moment = require('moment')
const Sequelize = require("sequelize");

const PORT = process.env.PORT || 5001
const options = {
    key: fs.readFileSync('/etc/letsencrypt/live/api.refettorio.cafe/privkey.pem'),
    cert: fs.readFileSync('/etc/letsencrypt/live/api.refettorio.cafe/fullchain.pem')
};
process.env.TZ = "Europe/Moscow"

const app = express()
app.use(cors({
    origin: "*"
}));
app.use(express.json())
app.use(express.static(path.resolve(__dirname, 'static')))
app.use(fileUpload({}))
app.use('/', router)

// Обработка ошибок, последний Middleware
app.use(errorHandler)

const start = async () => {
    try {
        await sequelize.authenticate()
        await sequelize.sync()
        https.createServer(options, app).listen(PORT);


        nodeCron.schedule('0 12 * * *', async (e) => {
            console.log('Запуск cron')
            let date = new Date();
            let day = date.getDate();
            let month = date.getMonth() + 1;
            let dateWeek = date;
            dateWeek.setDate(dateWeek.getDate() + 7);
            let dayWeek = dateWeek.getDate();
            let monthWeek = dateWeek.getMonth() + 1;

            //Оповещение о ДР в день ДР
            const userDay = await User.findAll({ where: { birthday_day: { [Op.or]: [String(day), '0' + day] }, birthday_month: { [Op.or]: [String(month), '0' + month] } } });

            if (userDay && userDay.length > 0) {
                console.log('Запланированные пуш уведомления отправлены')
                await NotificationsPush.send(
                    'Приходите к нам гулять, Вкусно есть и отдыхать! С днём рождения Вас поздравляем, Скидку 15% (на всю кухню) дарим!',
                    { name: 'Home' },
                    userDay.map(e => e.push_token)
                );
                userDay.map(async e =>
                    await Notification.create({
                        userId: e.id,
                        title: 'С днем рождения!',
                        desc: 'Приходите к нам гулять, Вкусно есть и отдыхать! С днём рождения Вас поздравляем, Скидку 15% (на всю кухню) дарим!',
                        params: JSON.stringify({ name: 'Notification' }),
                    }));
            }

            //Оповещение за неделю о ДР
            const userWeek = await User.findAll({ where: { birthday_day: { [Op.or]: [String(dayWeek), '0' + dayWeek] }, birthday_month: { [Op.or]: [String(monthWeek), '0' + monthWeek] } } });

            if (userWeek && userWeek.length > 0) {
                console.log('Запланированные пуш уведомления отправлены')
                await NotificationsPush.send(
                    'Кажется у тебя скоро день рождения! Отметь его с нами! В честь Дня рождения скидка 15% на меню по кухне и десерт в подарок!',
                    { name: 'Home' },
                    userWeek.map(e => e.push_token)
                );
                userWeek.map(async e =>
                    await Notification.create({
                        userId: e.id,
                        title: 'С наступающим днем рождения!',
                        desc: 'Кажется у тебя скоро день рождения! Отметь его с нами! В честь Дня рождения скидка 15% на меню по кухне и десерт в подарок!',
                        params: JSON.stringify({ name: 'Notification' }),
                    }));
            }

            //Оповещение о сгорании баллов за 30 дней
            const users = await User.findAll();

            if (users && users.length > 0) {
                users.map(async item => {
                    const userOrderMonth = await Order.findOne({
                        where: { phone: item.phone },
                        order: [['id', 'DESC']]
                    });

                    if (userOrderMonth) {
                        let dateOrder = moment().diff(moment(userOrderMonth.createdAt), 'days')
                        if (dateOrder == 30) {
                            await NotificationsPush.send(
                                'Через 30 дней у вас сгорят баллы, успейте потратить их на заказ',
                                { name: 'Home' },
                                [item.push_token]
                            );

                            await Notification.create({
                                userId: item.id,
                                title: 'У вас сгорают баллы',
                                desc: 'Через 30 дней у вас сгорят баллы, успейте потратить их на заказ',
                                params: JSON.stringify({ name: 'Notification' }),
                            })
                        }
                    }
                })
            }
            console.log('Завершение cron')
        },
            {
                timezone: "Europe/Moscow"
            });
        //http.createServer(app).listen(PORT);
    } catch (e) {
        console.log(e)
    }
}


start()
