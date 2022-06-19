import express, { Request, Response } from 'express'
import { body, query, validationResult } from 'express-validator'

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
    app.post('/dump',
        [
            body('options').optional().notEmpty()
        ],
        async (req: Request, res: Response) => {
            let apiKey = getBearerToken(req.headers.authorization)

            if (apiKey != ENV.API_KEY)
                return res.sendStatus(401)

            const options = req.body.options
            try {
                if (!isDumping) {
                    isDumping = true
                    await appProcesses.dumpAndSendToTelegram(options)
                    isDumping = false
                }
                res.status(200).send('Ok')
            }
            catch (err) {
                isDumping = false
                if (err instanceof Error)
                    res.status(409).send(`${err.name} — ${err.message}`)
            }
        })
}

