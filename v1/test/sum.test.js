import { describe, expect, it } from '@jest/globals';

import { sum } from '../src/sum.js';

describe('sum', () => {
    it('calculates the sum of a and b', () => {
        expect(sum(1, 4)).toEqual(5);
    })
})