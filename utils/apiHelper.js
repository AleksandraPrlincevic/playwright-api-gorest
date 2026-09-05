import { test, expect } from '@playwright/test';
import{USERS, POSTS} from './endpoints';
import { faker } from '@faker-js/faker';
import { configDotenv } from 'dotenv';

export async function getAllUsers(request) {
    const response = await request.get(USERS);
    const users = await response.json();
    return {response, users};
}

export async function getOneUser(request, userId) {
    const response = await request.get(`${USERS}/${userId}`);
    const user = await response.json();
    return { response, user}
}

export async function createNewUser(request, newUser) {
    const response = await request.post(USERS, {data: newUser});
    const createdUser = await response.json();
    return {response, createdUser};
}
export async function patchUser(request, userId, {data}) {
    const response = await request.patch(`${USERS}/${userId}`, {data});
    const updatedUser = await response.json();
    return {response, updatedUser};
}

//--------------data helpers----------------------------

export function getRandomUser(users){
    const randomUserIndex = Math.floor(Math.random()*users.length);
    return users[randomUserIndex];
  }

export function generateNewUser(){
     return {
        name: faker.person.fullName(),
        email: faker.internet.email(),
        gender: faker.helpers.arrayElement(['male', 'female']),
        status: faker.helpers.arrayElement(['active', 'inactive']),
    }
}
export function generateUserWithExistingEmail(existingEmail){
    const newUser = generateNewUser();
    newUser.email = existingEmail;
    return newUser;
}


