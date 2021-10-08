import * as child from 'child_process'
import * as fs from 'fs'
import dbConfig from '../configs/db.config'

import * as telegram from '../telegram/telegram'

const BACKUP_PATH = 'backup'

/**
 * 
 * @returns Collections export log
 */
export const start = async (): Promise<DumpResult> => {
    // Делается сейв всех коллекций заданных в db.config.ts
    return await new Promise(async function (resolve, reject) {
        try {
            let result: DumpResult = {
                log: '',
                archivePath: ''
            }

            // удаляем предыдущий backup
            child.exec(`rm -r ${BACKUP_PATH}`)

            for (let i = 0; i < dbConfig.bases.length; i++) {
                const db = dbConfig.bases[i]
                for (let j = 0; j < db.collections.length; j++) {
                    const collection = db.collections[j]
                    const collectionPath = await mongoExport(db.name, collection)

                    // узнать размер коллекции
                    result.log += `${collectionPath} ${getFileSizeMb(collectionPath)}mb\n`
                }
            }

            // делаем зип архив
            const archivePath = await zip(BACKUP_PATH, 'backup')
            result.log += `\nZip archive ~ ${getFileSizeMb(`${BACKUP_PATH}.zip`)}mb`
            result.archivePath = archivePath

            resolve(result)
            console.log(result.log)
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })

}

const mongoExport = async (dbName: string, collection: string): Promise<string> => {
    return await new Promise(function (resolve, reject) {
        try {
            const collectionPath = `${BACKUP_PATH}/${dbName}/${collection}.json`
            const commandMongoExport = `mongoexport --db ${dbName} -c ${collection} --out ${collectionPath}`
            var foo: child.ChildProcess = child.exec(commandMongoExport, (error: child.ExecException | null, stdout: string, stderr: string) => {
                resolve(collectionPath)
            })
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

/**
 * 
 * @param folderToZip 
 * @param outName 
 * @returns archive path
 */
const zip = async (folderToZip: string, outName: string): Promise<string> => {
    return await new Promise(function (resolve, reject) {
        try {
            const archivePath = `${outName}.zip`
            const commandMongoExport = `zip -r ${archivePath} ${folderToZip}`
            child.exec(commandMongoExport, (error: child.ExecException | null, stdout: string, stderr: string) => {
                console.log(stdout)
                resolve(archivePath)
            })
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

const getFileSizeMb = (path: string) => {
    const stats = fs.statSync(path)
    const fileSizeInBytes = stats.size
    const mb = fileSizeInBytes / (1024 * 1024)
    return mb.toFixed(2)
}

export type DumpResult = {
    log: string,
    archivePath: string,
}