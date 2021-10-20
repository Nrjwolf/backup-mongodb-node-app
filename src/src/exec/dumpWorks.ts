import * as child from 'child_process'
import * as fs from 'fs'
import { zip } from 'zip-a-folder'

import envConfig from '../configs/env.config'
import { niceBytes } from '../utils/niceBytes'

const BACKUP_PATH = 'dump'

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

            await execAsync(`rm -r ${BACKUP_PATH}`) // delete previous backup
            await execAsync(`mongodump`) // create dump

            // log sizes
            const allDirectories = await getDirectories(BACKUP_PATH)
            for (let i = 0; i < allDirectories.length; i++) {
                const dir = allDirectories[i]
                const fullDir = `${BACKUP_PATH}/${dir}`
                result.log += `${dir} ${getFileSizeMb(fullDir)}\n`
            }

            // create zip archive
            const archivePath = `${BACKUP_PATH}.zip`
            await zip(BACKUP_PATH, archivePath)

            result.log += `\nZip archive ~ ${getFileSizeMb(archivePath)}`
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

export const mongorestore = async (dir: string): Promise<string> => {
    return await execAsync(`mongorestore ${dir}`)
}

export const getDirectories = async (path: string): Promise<string[]> => {
    return fs.readdirSync(path).filter(function (file) {
        return fs.statSync(path + '/' + file).isDirectory()
    })
}

const execAsync = async (command: string): Promise<string> => {
    return await new Promise(function (resolve, reject) {
        try {
            child.exec(command, (error: child.ExecException | null, stdout: string, stderr: string) => {
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
    return niceBytes(stats.size)
}

export type DumpResult = {
    log: string,
    archivePath: string,
}