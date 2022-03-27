import dotenv from 'dotenv'
import * as rt from 'runtypes'

dotenv.config({})

const EnvConfig = rt.Record({
	TELEGRAM_BOT_TOKEN: rt.String,
	TELEGRAM_CHAT_TO_LOG: rt.String,
	ADMIN_TELEGRAM_ID: rt.String,

	API_KEY: rt.String,
})

export const ENV = EnvConfig.check(process.env)