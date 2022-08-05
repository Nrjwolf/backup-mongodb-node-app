import * as child from 'child_process'
import fastFolderSize from 'fast-folder-size'
import * as fs from 'fs'
import { zip } from 'zip-a-folder'
import { niceBytes } from '../utils/niceBytes'

export type DumpResult = {
    log: string,
    archivePath: string,
}

const BACKUP_PATH = 'dump'

/**
 * 
 * @returns Collections export log
 */
export const start = async (options: string = ''): Promise<DumpResult> => {
    return new Promise(async function (resolve, reject) {
        try {
            let result = {
                log: '',
                archivePath: '',
            }

            await execAsync(`rm -r ${BACKUP_PATH}`) // delete previous backup
            if (options.length > 0) {
                console.log(`mongodump ${options}`)
                await execAsync(`mongodump ${options}`) // create dump
            }
            else {
                await execAsync(`mongodump`)
            }

            // log sizes
            const allDirectories = await getDirectories(BACKUP_PATH)
            for (let i = 0;i < allDirectories.length;i++) {
                const dir = allDirectories[i]
                const fullDir = `${BACKUP_PATH}/${dir}`
                const size = await getFolderSize(fullDir)
                result.log += `${dir} ${size}\n`
            }

            // create zip archive
            const archivePath = `${BACKUP_PATH}.zip`
            if (fs.existsSync(BACKUP_PATH)) {
                await zip(BACKUP_PATH, archivePath)

                result.log += `\nZip archive ~ ${getFileSize(archivePath)}`
                result.archivePath = archivePath

                resolve(result)
                console.log(result.log)
            }
            else {
                throw new Error(`${archivePath} does not exist!`)
            }
        }
        catch (error) {
            console.error(error)
            reject(error)
        }
    })

}

/**
 * Executes a shell command 'mongorestore'
 * @param dir local path of dump folder
 * @param options string of options for mongorestore
 * @returns 
 */
export const mongorestore = async (dir: string, options: string): Promise<string> => {
    return await execAsync(`mongorestore ${dir} ${options}`)
}

/**
 * Returns an array of all directories in a folder
 * @param path local path of folder
 * @returns 
 */
export const getDirectories = async (path: string): Promise<string[]> => {
    try {
        return fs.readdirSync(path).filter(function (file) {
            return fs.statSync(path + '/' + file).isDirectory()
        })
    }
    catch (err) {
        return []
    }
}

/**
 * Executes a shell command in async mode
 * @param command 
 * @returns 
 */
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

/**
 * Returns the size of a file in nice format (e.g. 1.5 MB)
 * @param path 
 * @returns 
 */
const getFileSize = (path: string) => {
    const stats = fs.statSync(path)
    return niceBytes(stats.size)
}

/**
 * Returns the size of a folder in nice format (e.g. 1.5 MB)
 * @param path 
 * @returns 
 */
const getFolderSize = async (path: string) => {
    return await new Promise(function (resolve, reject) {
        try {
            fastFolderSize(path, (err, bytes) => {
                if (err) {
                    reject(err)
                } else {
                    resolve(niceBytes(bytes!))
                }
            })
        }
        catch (error) {
            reject(error)
        }
    })

}