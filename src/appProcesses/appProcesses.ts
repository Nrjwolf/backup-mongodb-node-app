import { ENV } from "../configs/env"

import * as dumpWorks from '../exec/dumpWorks'
import * as telegram from '../telegram/telegram'
import telegramBotRepliesConfig from '../configs/telegramBotReplies.config'

export const dumpAndSendToTelegram = async (dumpOtions: string = '') => {
    try {
        const startTime = performance.now()
        const dumpLog = await dumpWorks.start(dumpOtions)
        console.log(`Dump finished in ${(performance.now() - startTime).toFixed(2)} milliseconds ✅`)
        const caption = `#${telegram.botInfo.username}\n\n<pre>${dumpLog.log}</pre>`
        await telegram.logFile(dumpLog.archivePath, caption)
    }
    catch(err) {
        throw err
    }
}