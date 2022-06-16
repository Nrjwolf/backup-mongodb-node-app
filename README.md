# Backup your MongoDB

Telegram bot creates **MongoDB** dump by executing command `mongodump` and sends it to your chat

## Usage

`/start` — force create dump  
To restore just send to bot chat dump archieve

## Installation and local launch

1. Clone this repo: `git clone https://github.com/Nrjwolf/backup-mongodb-node-app`
2. Create `.env` file with the environment variables listed below
3. Run `yarn` in the root folder
4. Run `yarn start`

## Environment variables in `.env` file

| Variable                     | Description                                                       |
| ---------------------------- | ----------------------------------------------------------------- |
| `TELEGRAM_BOT_TOKEN`         | Telegram bot token (use @BotFather)                               |
| `TELEGRAM_CHAT_TO_LOG`       | ID of log chat, you can find it with @userinfobot                 |
| `ADMIN_TELEGRAM_ID`          | Your admin id (via @userinfobot), only this user can controll bot |

## License

MIT — use for any purpose. Would be great if you could leave a note about the original developers. Thanks!