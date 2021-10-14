import TelegramBot, { Message } from 'node-telegram-bot-api'
import * as fs from 'fs'
import envConfig from '../configs/env.config'

const bot = new TelegramBot(envConfig.TELEGRAM_BOT_TOKEN, { polling: true })

export const init = async () => {
    const botMe = await bot.getMe()
    console.log(`✅ Telegram bot @${botMe.username} initialized!`)
}

export const logText = async (text: string) => {
    const options: TelegramBot.SendMessageOptions = {
        parse_mode: "HTML",
    }
    await bot.sendMessage(envConfig.TELEGRAM_CHAT_TO_LOG, text, options)
}

export const logFile = async (path: string) => {
    const fileOptions = {
        filename: 'mongoexport.zip',
        contentType: 'application/octet-stream',
    }
    bot.sendDocument(envConfig.TELEGRAM_CHAT_TO_LOG, path, {}, fileOptions)
}