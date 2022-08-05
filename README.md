# Backup your MongoDB

Telegram bot creates **MongoDB** dump by executing command `mongodump` and sends it to your chat

## Usage

`/start` — force create dump with local db  
To restore just send to chat with bot the dump archieve, also you can send it with options in caption

![Group](https://user-images.githubusercontent.com/10683971/183007764-8ca10af9-9194-46c7-bf5a-1bd031557ad1.png)

## Installation and local launch

1. Clone this repo: `git clone https://github.com/Nrjwolf/backup-mongodb-node-app`
2. Create `.env` file with the environment variables listed below
3. Run `yarn` in the root folder
4. Run `yarn start`

## Endpoints

**post**  
`/dump` — calls `mongodump`, you can also put `options` in body

## Environment variables in `.env` file

| Variable                     | Description                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`         | Telegram bot token (use @BotFather)                               |
| `TELEGRAM_CHAT_TO_LOG`       | ID of log chat, you can find it with @userinfobot                 |
| `ADMIN_TELEGRAM_ID`          | Your admin id (via @userinfobot), only this user can controll bot |
| `API_KEY`                    | Bearer token for endpoints usage                                  |

## License

MIT — use for any purpose. Thanks!
