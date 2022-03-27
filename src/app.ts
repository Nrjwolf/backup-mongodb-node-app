import { ENV } from "./configs/env"

require('./utils/colorsLog')
import * as colorsLog from './utils/colorsLog'

import * as telegram from './telegram/telegram'
import * as enpoints from './endpoints'

const init = async () => {
    try {
        console.log(`⌛️ ${require('../package.json').name} started...`)
        await enpoints.init()
        await telegram.init()
        console.log(`✅✅✅ Initialization COMPLETE!`.green())
    }
    catch (err) {
        console.log(`❌❌❌ Initialization FAILED!`.red())
    }
}

init()
