import TelegramBot, { Message } from 'node-telegram-bot-api'
import download from 'download'
import extract from 'extract-zip'
import * as child from 'child_process'
import envConfig from '../configs/env.config'
import path from 'path'
import { mongorestore } from '../exec/dumpWorks'
import telegramBotRepliesConfig from '../configs/telegramBotReplies.config'
import { dumpAndSendToTelegram } from '../../app'

const DOWNLOADED_PATH = 'downloaded'
const bot = new TelegramBot(envConfig.TELEGRAM_BOT_TOKEN, { polling: true })

export const init = async () => {
    const botMe = await bot.getMe()
    bot.on('message', onMessage)
    console.log(`✅ Telegram bot @${botMe.username} initialized!`)
}

export const onMessage = async (msg: Message) => {
    if (msg.from?.id.toString() != envConfig.ADMIN_TELEGRAM_ID) return

    if (msg.text == '/start') {
        dumpAndSendToTelegram()
    }

    // download dump.zip
    if (msg.document) {
        try {
            bot.sendMessage(msg.from.id, telegramBotRepliesConfig.restore.restore_started)

            // delete previous backup
            child.exec(`rm -r ${DOWNLOADED_PATH}`)

            // download and unzip recieved dump
            const telegram_file = await bot.getFile(msg.document.file_id)
            const telegram_url = `https://api.telegram.org/file/bot${envConfig.TELEGRAM_BOT_TOKEN}/${telegram_file.file_path}`
            await download(telegram_url, DOWNLOADED_PATH)
            await extract(`${DOWNLOADED_PATH}/${path.basename(telegram_file.file_path!)}`, { dir: `${process.cwd()}/${DOWNLOADED_PATH}` })

            // restore
            await mongorestore(`${DOWNLOADED_PATH}`)

            bot.sendMessage(msg.from.id, telegramBotRepliesConfig.restore.restore_success)
        }
        catch (err) {
            bot.sendMessage(msg.from.id, telegramBotRepliesConfig.restore.restore_fail)
            bot.sendMessage(msg.from.id, (err as Error).message)
        }
    }
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