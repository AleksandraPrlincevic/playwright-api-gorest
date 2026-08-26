
import { test, expect } from '@playwright/test';
import{USERS, POSTS} from '../utils/endpoints';

test('canGetAllUsers', async ({ request }) => {
    const response = await request.get(USERS);

    expect(response.status()).toBe(200);

    const users = await response.json();

    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
    });
});

test('canGetOneUser', async ({request}) => {
  const response = await request.get(USERS);
  expect(response.status()).toBe(200);
  const users = await response.json();
  expect(Array.isArray(users)).toBe(true);

  function getRandomUser(users){
    const randomUserIndex = Math.floor(Math.random()*users.length);
    return users[randomUserIndex];
  }
  const randomUser = getRandomUser(users); 
  const randomUserId = randomUser.id;
  const randomUserName = randomUser.name;
  const randomUserEmail = randomUser.email;
  
  const response2 = await request.get(`${USERS}/${randomUserId}`)
  expect(response2.status()).toBe(200);
  const user = await response2.json();

  expect(user.name).toEqual(randomUserName);
  expect(user.email).toEqual(randomUserEmail);
  expect(user.id).toEqual(randomUserId);
  
})
