import { describe, expect, it } from '@jest/globals';
import { readFile } from '../../../vef2-2022-v1-synilausn/src/lib/file';
import { direxists, readAFile, readFilesFromDir } from '../lib/file';

describe('file', () => {
    describe('direxists', () => {
        it('returns false if dir does not exist', async () => {
            const result = await direxists('./nonexistent');
            expect(result).toBe(false);
        });

        it('returns true if dir exists', async() => {
            const result = await direxists('./src');
            expect(result).toBe(true);
        })

        it('returns false if there no parameter', async () => {
            const result = await direxists();
            expect(result).toBe(false);
        });
    });

    describe('readFilesFromDir', () => {
        it('should return an empty array if a dir does not exist', async () => {

            const result = await readFilesFromDir('./nonexistent');

            expect(result).toEqual([]);
        });

        it('should return array of known files within a dir that does exist', async () => {
            const result = await readFilesFromDir('./src/thisisadir');

            expect(result).toEqual([
                'src/thisisadir/parsethis.csv',
                'src/thisisadir/thisisafile.csv',
                'src/thisisadir/thisisajson.json',
            ]);
        });
    });

    describe('readAFile', () => {
        it('should return null for a file that does not exist', async () => {
            const result = await readAFile('./nonexistentfile');

            expect(result).toEqual(null);
        });

        it('should return content of known file that does exist', async () => {
            const result = await readAFile('./src/thisisadir/thisisafile.csv');
      
            expect(result).toEqual('content');
        });
    });

    describe('readJSON', () => {
        it('should return error if parsing was unsuccessful', async () => {;
            const response = await readFile('./src/thisisadir/thisisajson.json');
            const data = JSON.parse(response);

            const obj = {"test": "test"};

            expect(data).toEqual(obj);
        })
    })
});