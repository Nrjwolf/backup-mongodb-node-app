import { Collection, ListDatabasesResult, MongoClient } from 'mongodb'
import * as child from 'child_process'
import * as fs from 'fs'

import * as telegram from '../telegram/telegram'
import envConfig from '../configs/env.config'

const BACKUP_PATH = 'backup'
const mongURI = envConfig.MONG_URI
const mongClient = new MongoClient(mongURI, {})

/**
 * 
 * @returns Collections export log
 */
export const start = async (): Promise<DumpResult> => {
    return await new Promise(async function (resolve, reject) {
        try {
            let result = {
                log: '',
                archivePath: '',
            }

            // delete previous backup
            child.exec(`rm -r ${BACKUP_PATH}`)

            await mongoConnect()
            const dbsResult = await getAllDatabases()

            for (let i = 0; i < dbsResult.databases.length; i++) {
                const db = dbsResult.databases[i]
                var collections = await mongClient.db(db.name).listCollections().toArray()

                for (let j = 0; j < collections.length; j++) {
                    const collection = collections[j]
                    const collectionPath = await mongoExport(db.name, collection.name)

                    // get collection size
                    result.log += `${collectionPath.replace(`${BACKUP_PATH}/`, '')} ${getFileSizeMb(collectionPath)}mb\n`
                }
            }

            // create zip archive
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

const mongoConnect = async () => {
    return await new Promise(function (resolve, reject) {
        try {
            mongClient
                .connect()
                .then(client => {
                    resolve(null)
                })
        }
        catch (error) {
            reject(error)
        }
    })
}

const getAllDatabases = async (): Promise<ListDatabasesResult> => {
    return await new Promise(function (resolve, reject) {
        try {
            mongClient.db().admin().listDatabases().then(dbs => {
                resolve(dbs)
            })
        }
        catch (error) {
            reject(error)
        }
    })
}

const getAllCollections = async (dbName: string) => {
    await mongClient.db(dbName).listCollections().toArray()
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