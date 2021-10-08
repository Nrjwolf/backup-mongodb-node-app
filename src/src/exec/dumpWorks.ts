import * as child from 'child_process'
import dbConfig from '../configs/db.config'

const BACKUP_PATH = 'backup'

export const start = async () => {
    // Делается сейв всех коллекций заданных в db.config.ts
    return await new Promise(async function (resolve, reject) {
        try {
            // удаляем предыдущий backup
            child.exec(`rm -r ${BACKUP_PATH}`)

            for (let i = 0; i < dbConfig.bases.length; i++) {
                const db = dbConfig.bases[i]
                for (let j = 0; j < db.collections.length; j++) {
                    const collection = db.collections[j]
                    console.log(`Дамп ${db.name} ${collection}`)
                    await mongoExport(db.name, collection)
                }
            }

            resolve(null)
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })

}

const mongoExport = async (dbName: string, collection: string) => {
    return await new Promise(function (resolve, reject) {
        try {
            const commandMongoExport = `mongoexport --db ${dbName} -c ${collection} --out ${BACKUP_PATH}/${dbName}/${collection}.json`
            var foo: child.ChildProcess = child.exec(commandMongoExport, (error: child.ExecException | null, stdout: string, stderr: string) => {
                resolve(null)
            })
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })
}