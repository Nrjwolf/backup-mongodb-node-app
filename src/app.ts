import dotenv from 'dotenv'
dotenv.config()

require('./src/utils/colorsLog')
import * as colorsLog from './src/utils/colorsLog'

import * as dumpWorks from './src/exec/dumpWorks'
import * as telegram from './src/telegram/telegram'
import { delay } from './src/utils/utils'
import envConfig from './src/configs/env.config'
import telegramBotRepliesConfig from './src/configs/telegramBotReplies.config'

const init = async () => {
    try {
        await telegram.init()

        console.log(`✅✅✅ Initialization COMPLETE!`.green())
        runProcess()
    }
    catch (err) {
        console.log(`❌❌❌ Initialization FAILED!`.red())
    }
}

const runProcess = async () => {
    const delayTimeHours = parseInt(envConfig.DUMP_PROCESS_INTERVAL) // run every n hours
    const delayTime = delayTimeHours * (60 * (60 * 1000))
    while (true) {

        await dumpAndSendToTelegram()
        await delay(delayTime)
    }
}

export const dumpAndSendToTelegram = async () => {
    const dumpLog = await dumpWorks.start()
    await telegram.logText(`<pre>${dumpLog.log}</pre>`)
    await telegram.logFile(dumpLog.archivePath)
    await telegram.logText(telegramBotRepliesConfig.other.next_dump_time.replace('{0}', envConfig.DUMP_PROCESS_INTERVAL))
}

init()
