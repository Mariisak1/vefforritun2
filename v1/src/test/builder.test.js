import { main } from '../builder.js'
import { describe, expect, it } from '@jest/globals';

describe('builder', () => {
    describe('main', () => {
        it('should not return anything', async () => {
            const result = await main();
            expect(result).toEqual();
        });
    });
});
