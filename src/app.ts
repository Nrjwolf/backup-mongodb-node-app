import dotenv from 'dotenv'
dotenv.config()

require('./src/utils/colorsLog')
import * as colorsLog from './src/utils/colorsLog'

import * as dumpWorks from './src/exec/dumpWorks'

const init = async () => {
    try {
        console.log(`✅✅✅ Initialization COMPLETE!`.green())


        runProcess()
    }
    catch (err) {
        console.log(`❌❌❌ Initialization FAILED!`.red())
    }
}

const runProcess = async () => {
    // TODO: запускать каждые 6 часов (например)
    await dumpWorks.start()
}

init()
