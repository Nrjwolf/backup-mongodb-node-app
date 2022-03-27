import { ENV } from "../configs/env"

import * as dumpWorks from '../exec/dumpWorks'
import * as telegram from '../telegram/telegram'
import telegramBotRepliesConfig from '../configs/telegramBotReplies.config'

export const dumpAndSendToTelegram = async () => {
    const dumpLog = await dumpWorks.start()
    const caption = `#${telegram.botInfo.username}\n\n<pre>${dumpLog.log}</pre>`
    await telegram.logFile(dumpLog.archivePath, caption)
}