import { afterAll, beforeAll, afterEach, beforeEach, describe, expect, it } from '@jest/globals';
import dotenv from 'dotenv';
import {
    findByUsername,
    createUser,
} from '../lib/users';
  import { end, dropSchema, createSchema, clearData } from '../lib/db';

dotenv.config({ path: './.env.test' });

describe('users', () => {
  beforeAll(async () => {
    await dropSchema();
    await createSchema();
  });

  afterAll(async () => {
    await end();
  });

  beforeEach(async () => {
    await createSchema();
  })

  afterEach(async () => {
    await clearData();
  })

  it('finds a user by username', async () => {
      await createUser('yes', 'yes');
      const result = await findByUsername('yes');

      expect(result.username).toEqual('yes');
  });

  it('creates a user', async () => {
    const user = await createUser('no', 'no');
    expect(user.username).toEqual('no');
});
});