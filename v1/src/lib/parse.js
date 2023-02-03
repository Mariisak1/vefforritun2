import path, { join } from 'path';
import { readAFile } from './file.js'

export function parseJSON(content){
    return content;
}

export async function parseCSV(file){
    const thefile = await readAFile(file, { encoding: 'latin1' });
    let lines = [];
    let header = ['number', 'name', 'credits', 'semester', 'level', 'path'];
    if(thefile && file.length > 0){
        lines = thefile.split('\n');
    }
    let jsonObj = [];

    for(let i = 1; i < lines.length; i++){
        let line = lines[i].split(';');
        let object = {};
        for(let j = 0; j < line.length; j++){
            object[header[j]] = line[j];
        }
        jsonObj.push(object);
    }
    JSON.stringify(jsonObj);

    console.log('%j', jsonObj);
    return jsonObj;
}