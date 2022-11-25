const TelegramBot = require('node-telegram-bot-api')
class Telegram {
    constructor(){
        this.token = '5009717286:AAGykKYPMi_Hb3O9i3lGp30Ae0DuD95WoI0'
    }
    send(text) {
        if(text && text.length > 0){
            const bot = new TelegramBot(this.token, {polling: true})
            const chatId = '-1001580214885'
            bot.sendMessage(chatId, text, {parse_mode: 'HTML'})
            return true
        }else{
            return false
        }
    }
}
module.exports = new Telegram()