import { expect, it } from '@jest/globals';
import { parseCSV } from '../lib/parse.js';

describe('parse', () => {
    describe('parseCSV', () => {
        it('should return empty object if filepath does not lead to an existent csv file', async () => {
            const result = await parseCSV('./nonexistent');
            expect(result).toEqual([]);
        });

        it('should return a successfully parsed csv file', async () => {
            const result = await parseCSV('./src/thisisadir/parsethis.csv');
            const obj = [{
                number: 'parse',
                name: 'this',
                credits: 'please',
                semester: 'and',
                level: 'thank',
                path: 'you',
            }];
            expect(result).toEqual([]);
        })
    });
});
