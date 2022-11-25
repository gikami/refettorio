const jwt = require('jsonwebtoken')

module.exports = function (req, res, next) {
    if (req.method === "OPTIONS") {
        next()
    }
    try {
        const token = req.headers.authorization.split(' ')[1] // Bearer asfasnfkajsfnjk
        if (!token) {
            return res.status(401).json({message: "Нет данных авторизации, перезайдите в свой профиль"})
        }
        const decoded = jwt.verify(token, process.env.SECRET_KEY)
        req.user = decoded
        next()
    } catch (e) {
        console.error(e)
        res.status(401).json({message: "Время авторизации истекло"})
    }
};
