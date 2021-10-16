import { Collection, ListDatabasesResult, MongoClient } from 'mongodb'
import * as child from 'child_process'
import * as fs from 'fs'
import { zip } from 'zip-a-folder'

import * as telegram from '../telegram/telegram'
import envConfig from '../configs/env.config'
import { niceBytes } from '../utils/niceBytes'

const BACKUP_PATH = 'dump'
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
                await mongodump(db.name)
                result.log += `${db.name} ${niceBytes(db.sizeOnDisk!)}\n`
            }

            // create zip archive
            const archivePath = `${BACKUP_PATH}.zip`
            await zip(BACKUP_PATH, archivePath)

            result.log += `\nZip archive ~ ${getFileSizeMb(archivePath)}mb`
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

const mongodump = async (dbName: string): Promise<string> => {
    return await new Promise(function (resolve, reject) {
        try {
            const collectionPath = `${BACKUP_PATH}/${dbName}/`
            const commandMongoExport = `mongodump --db ${dbName}`
            child.exec(commandMongoExport, (error: child.ExecException | null, stdout: string, stderr: string) => {
                resolve(collectionPath)
            })
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })
}

export const mongorestore = async (dir: string): Promise<string> => {
    return await new Promise(function (resolve, reject) {
        try {
            const commandMongoExport = `mongorestore ${dir}`
            child.exec(commandMongoExport, (error: child.ExecException | null, stdout: string, stderr: string) => {
                resolve(stdout)
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