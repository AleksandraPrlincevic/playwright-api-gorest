
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

test('can create new user', async({request}) => {
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

test('canNot create a user with existing email', async({request})=>{
   const user = apiHelper.generateNewUser();
   const {createdUser} = await apiHelper.createNewUser(request, user);
   const existingEmail = createdUser.email;

   const userWithExistingEmail = apiHelper.generateUserWithExistingEmail(existingEmail);
   const {response: response2, createdUser: responseBody} = await apiHelper.createNewUser(request, userWithExistingEmail);
   
   expect(response2.status()).toBe(422);
   expect(responseBody[0].field).toContain("email");
   expect(responseBody[0].message).toContain("taken");
  })
  
  test('can change an email field of existing user', async({request})=>{
    const user = apiHelper.generateNewUser();
    const {createdUser} = await apiHelper.createNewUser(request, user);
    const userId = createdUser.id;

    const newEmail = faker.internet.email();
    const {response, updatedUser} = await apiHelper.patchUser(request, userId, {data: {email: newEmail}});
  
    expect(response.status()).toBe(200);
    expect(updatedUser.email).toEqual(newEmail);
    expect(updatedUser.id).toEqual(createdUser.id);
    expect(updatedUser.gender).toEqual(createdUser.gender);
    expect(updatedUser.status).toEqual(createdUser.status);
    expect(updatedUser.name).toEqual(createdUser.name);
    
  })
   test('can replace a user', async ({request})=>{
    const user = apiHelper.generateNewUser();
    const {createdUser} = await apiHelper.createNewUser(request, user);
    const userId = createdUser.id;
    const changedUser = apiHelper.generateNewUser();

    const {response, substituteUser} = await apiHelper.putUser(request, userId, changedUser);

    expect(response.status()).toBe(200);
    expect(substituteUser.id).toEqual(userId);
    expect(substituteUser.name).toEqual(changedUser.name);
    expect(substituteUser.email).toEqual(changedUser.email);
    expect(substituteUser.gender).toEqual(changedUser.gender);
    expect(substituteUser.status).toEqual(changedUser.status);
   })
    test('can delete a user', async ({request})=> {
      const user = apiHelper.generateNewUser();
      const {createdUser} = await apiHelper.createNewUser(request, user);
      const userId = createdUser.id;
    
      const response = await apiHelper.deleteUser(request, userId);

      expect(response.status()).toBe(204);
      
      const {response: response2, user: responseBody} = await apiHelper.getOneUser(request, userId);
      
      expect(response2.status()).toBe(404);
      expect(responseBody.message).toContain("not found");
    })
