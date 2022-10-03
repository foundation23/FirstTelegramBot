const TelegramApi = require('node-telegram-bot-api')
const {gameOptions, againOptions} = require('./options')
const token = "5768018728:AAEj0dXyFhOXdll3qJP1F8ArbmoQHnIC2ww"

const bot = new TelegramApi(token, {polling: true})

const chats = {}



const startGame = async (chatId) => {
    await bot.sendMessage(chatId, "я загадаю число от 0 до 9, попробуй отгадай")
    const randomNumber = Math.floor(Math.random() * 10)
    chats[chatId] = randomNumber
    await bot.sendMessage(chatId, 'Отгадывай', gameOptions)
}

const start = () => {
    bot.setMyCommands([
            {command: '/start', description: 'начальное приветствие'},
            {command: '/info', description: 'получить информацию о пользователе'},
            {command: '/game', description: 'начать игру'}
        ]
    )

    bot.on('message', async smg => {
            const text = smg.text;
            const chatId = smg.chat.id;

            if (text === '/start') {
                await bot.sendSticker(chatId, 'https://chpic.su/_data/stickers/l/ladyftdpool/ladyftdpool_001.webp')
                return bot.sendMessage(chatId, `добро пожаловать, я не пока не знаю на что способен, но Максим меня допилит обязательно`)
            }
            if (text === '/info') {
                return bot.sendMessage(chatId, `тебя зовут: ${smg.from.first_name} ${smg.from.last_name} `)
            }
            if (text === '/game') {
                return startGame(chatId)
            }
            return bot.sendMessage(chatId, `я тебя не понимаю,${smg.from.first_name}, попробуй еще раз`)

        }
    )
    bot.on('callback_query', async smg => {
        const data = smg.data
        const chatId = smg.message.chat.id
        if (data === '/again') {
            startGame(chatId)
        }

        if (data === chats[chatId]) {
            return bot.sendMessage(chatId, `Поздравляю! Ты угадал! ${chats[chatId]}`, againOptions)
        } else {
            return bot.sendMessage(chatId, `Не угадал, я загадал ${chats[chatId]}`, againOptions)
        }
    })
}

start()
