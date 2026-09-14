
import { test, expect } from '@playwright/test';
import{USERS, POSTS} from '../utils/endpoints';
import * as apiHelper from '../utils/apiHelper.js';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

test('can get all users', async ({ request }) => {
    const {response, users } = await apiHelper.getAllUsers(request);
    expect(response.status()).toBe(200);
    expect(Array.isArray(users)).toBe(true);
    expect(users.length).toBeGreaterThan(0);

    users.forEach(user => {
        expect(user).toHaveProperty('id');
        expect(user).toHaveProperty('name');
        expect(user).toHaveProperty('email');
    });
});

test('can get one user', async ({request}) => {
 const { response, users } = await apiHelper.getAllUsers(request);
  expect(response.status()).toBe(200);
  expect(Array.isArray(users)).toBe(true);

  const randomUser = apiHelper.getRandomUser(users); 
  const randomUserId = randomUser.id;
  const randomUserName = randomUser.name;
  const randomUserEmail =randomUser.email;
  
  const { response: response2, user: fetchedUser } = await apiHelper.getOneUser(request, randomUserId)
  
  expect(response2.status()).toBe(200);
  expect(fetchedUser.name).toEqual(randomUserName);
  expect(fetchedUser.email).toEqual(randomUserEmail);
  expect(fetchedUser.id).toEqual(randomUserId);
})

test('Can create new user', async({request}) => {
  const newUser = apiHelper.generateNewUser();
  const userName = newUser.name;
  const userEmail = newUser.email;
  const userGender = newUser.gender;
  const userStatus = newUser.status;

  const {response: response3, createdUser} = await apiHelper.createNewUser(request, newUser);

  expect(response3.status()).toBe(201);
  expect(createdUser).toHaveProperty('id');
  expect(createdUser.name).toEqual(userName);
  expect(createdUser.email).toEqual(userEmail);
  expect(createdUser.gender).toEqual(userGender);
  expect(createdUser.status).toEqual(userStatus);

})

test('CanNot create a user with existing email', async({request})=>{
   const { users } = await apiHelper.getAllUsers(request);
   const randomUser = apiHelper.getRandomUser(users); 
   const randomUserEmail =randomUser.email;

   const userWithExistingEmail = apiHelper.generateUserWithExistingEmail(randomUserEmail);

   const {response: response2, createdUser} = await apiHelper.createNewUser(request, userWithExistingEmail);
   const responseBody = await response2.json();

   expect(response2.status()).toBe(422);
   expect(responseBody[0].field).toContain("email");
   expect(responseBody[0].message).toContain("taken");
  })
  
  test('can change an email field of existing user', async({request})=>{
    const {users} =  await apiHelper.getAllUsers(request);
    const randomUser = apiHelper.getRandomUser(users);
    const randomUserId = randomUser.id;
    const newEmail = faker.internet.email();
    const {response, updatedUser} = await apiHelper.patchUser(request, randomUserId, {data: {email: newEmail}});
  
    expect(response.status()).toBe(200);
    expect(updatedUser.email).toEqual(newEmail);
    expect(updatedUser.id).toEqual(randomUserId);
  })
   test('can replace a user', async ({request})=>{
    const {users} = await apiHelper.getAllUsers(request);
    const randomUser = apiHelper.getRandomUser(users);
    const randomUserId = randomUser.id;
    const changedUser = apiHelper.generateNewUser();

    const {response, substituteUser} = await apiHelper.putUser(request, randomUserId, changedUser);

    expect(response.status()).toBe(200);
    expect(substituteUser.id).toEqual(randomUserId);
    expect(substituteUser.name).toEqual(changedUser.name);
    expect(substituteUser.email).toEqual(changedUser.email);
    expect(substituteUser.gender).toEqual(changedUser.gender);
    expect(substituteUser.status).toEqual(changedUser.status);
   })
    test('can delete a user', async ({request})=> {
      const {users} = await apiHelper.getAllUsers(request);
      const randomUser = apiHelper.getRandomUser(users);
      const randomUserId = randomUser.id;
    
      const response = await apiHelper.deleteUser(request, randomUserId);

      expect(response.status()).toBe(204);
      
      const {response: response2} = await apiHelper.getOneUser(request, randomUserId);
      const responseBody = await response2.json();
      expect(response2.status()).toBe(404);
      expect(responseBody.message).toContain("not found");
    })
