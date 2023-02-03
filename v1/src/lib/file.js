import { readdir, readFile, stat } from 'fs/promises';
import path, { join } from 'path';
import { parseJSON } from './parse.js';


/**
* Check if a directory exists.
* @param {string} dir Directory to check
* @returns `true` if dir exists, `false` otherwise
*/
export async function direxists(dir) {
  try {
    const info = await stat(dir);
    return info.isDirectory();
  } catch (e) {
    return false;
  }
}

/**
 * Read only files from a directory and returns as an array.
 * @param {string} dir Directory to read files from
 * @returns {string[]} Array of files in dir with full path, empty if error or no files
 */
export async function readFilesFromDir(dir) {
    let files = [];
    try {
        files = await readdir(dir);
    } catch (e) {
        return [];
    }

    const result = files.map(async (file) => {
        let path = join(dir, file);
        const info = await stat(path);

        if(info.isDirectory()) {
            return null;
        }

        path = path.replace(/\\/g,"/");
        return path;
    })

    const resresult = await Promise.all(result);

    // Remove any directories that will be represented by `null`
    return resresult.filter(Boolean);
}


/**
 * Read a file and return its content.
 * @param {string} file File to read
 * @param {object} options.encoding asdf
 * @returns {Promise<string | null>} Content of file or `null` if unable to read.
 */
export async function readAFile(file, { encoding = 'utf8' } = {}) {
    try {
        const content = await readFile(file);
        return content.toString(encoding);
    } catch(e) {
        return null;
    }
}

export async function readJSON(filePath){
    const response = await readFile(filePath);
    let data = null;
    try {
      data = JSON.parse(response);
      //data = parseJSON(response);
    } catch (err) {
      console.error('Villa!', err);
    }
    return data;
}

