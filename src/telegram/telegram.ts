import { ENV } from '../configs/env'
import TelegramBot, { Message } from 'node-telegram-bot-api'
import download from 'download'
import extract from 'extract-zip'
import * as child from 'child_process'
import path from 'path'
import { mongorestore } from '../exec/dumpWorks'
import telegramBotRepliesConfig from '../configs/telegramBotReplies.config'
import { getCurrentDateFormat } from '../utils/utils'
import * as appProcesses from '../appProcesses/appProcesses'

const DOWNLOADED_PATH = 'downloaded'
export const bot = new TelegramBot(ENV.TELEGRAM_BOT_TOKEN, { polling: true })
export var botInfo: TelegramBot.User

export const init = async () => {
    botInfo = await bot.getMe()
    bot.on('message', onMessage)
    console.log(`✅ Telegram bot @${botInfo.username} initialized!`)
    logText(telegramBotRepliesConfig.other.bot_started)
}

export const onMessage = async (msg: Message) => {
    if (msg.from?.id.toString() != ENV.ADMIN_TELEGRAM_ID) return

    if (msg.text == '/start') {
        appProcesses.dumpAndSendToTelegram()
    }

    // Here is restoring process with recieved dump
    if (msg.document) {
        try {
            bot.sendMessage(msg.from.id, telegramBotRepliesConfig.restore.restore_started)

            // delete previous backup
            child.exec(`rm -r ${DOWNLOADED_PATH}`)

            // download and unzip recieved dump
            const telegram_file = await bot.getFile(msg.document.file_id)
            const telegram_url = `https://api.telegram.org/file/bot${ENV.TELEGRAM_BOT_TOKEN}/${telegram_file.file_path}`
            await download(telegram_url, DOWNLOADED_PATH)
            await extract(`${DOWNLOADED_PATH}/${path.basename(telegram_file.file_path!)}`, { dir: `${process.cwd()}/${DOWNLOADED_PATH}` })

            // restore
            console.log(msg.caption)
            await mongorestore(`${DOWNLOADED_PATH}`, msg.caption ?? '')

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
    await bot.sendMessage(ENV.TELEGRAM_CHAT_TO_LOG, text, options)
}

export const logFile = async (path: string, caption: string = '') => {
    const botMe = await bot.getMe()
    const fileOptions = {
        filename: `Mongodump ${botMe.first_name} ${getCurrentDateFormat()}.zip`,
        contentType: 'application/octet-stream',
    }
    await bot.sendDocument(ENV.TELEGRAM_CHAT_TO_LOG, path, { parse_mode: 'HTML', caption: caption }, fileOptions)
}