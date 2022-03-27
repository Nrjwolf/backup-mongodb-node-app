import express from 'express'

import * as appProcesses from './appProcesses/appProcesses'
import { ENV } from './configs/env'

var app = express()
app.use(express.json())
app.use(express.urlencoded({
    extended: true
}))

let isDumping = false

const getBearerToken = (auth: string | undefined) => {
    const PREFIX = `Bearer `
    if (!auth || !auth.toLowerCase().startsWith(PREFIX.toLowerCase()))
        return undefined

    let token = auth.substring(PREFIX.length)
    return token
}

export const init = async () => {
    const port = 7001
    app.listen(port, () => console.log(`🚀 Server running on port ${port}`))

    app.get('/v', (req, res) => {
        res.json({
            name: require('../package.json').name,
            v: require('../package.json').version
        })
    })

    /**
     * Делает дамп, отправляет в телегу
     */
    app.post('/dump', async (req, res) => {
        let apiKey = getBearerToken(req.headers.authorization)

        if (apiKey != ENV.API_KEY)
            return res.sendStatus(401)

        if (!isDumping) {
            isDumping = true
            appProcesses.dumpAndSendToTelegram()
        }

        return res.status(200).send('Ok')
    })
}

