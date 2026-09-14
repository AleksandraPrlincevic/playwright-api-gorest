import { test, expect } from '@playwright/test';
import{USERS, POSTS, TODOS} from './endpoints';
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
export async function putUser(request, userId, user){
    const response = await request.put(`${USERS}/${userId}`, {data: user});
    const substituteUser = await response.json();
    return{response, substituteUser};
}
export async function deleteUser(request, userId) {
    const response = await request.delete(`${USERS}/${userId}`);
    return response;
}

//---------------asyncs for todos-----------------------
export async function getAllTodos(request){
   const response = await request.get(TODOS);
   const todos = await response.json();
   return {response, todos};
}
export async function createNewTodo(request, newTodo){
    const response = await request.post(TODOS, {data: newTodo});
    const todo = await response.json();
    return {response, todo};
}
export async function getAllTodosFromOneUser(request, userId){
    const response = await request.get(`${USERS}/${userId}/${TODOS}`);
    const usersTodos = await response.json();
    return {response, usersTodos};
}
export async function createTodoViaUserEndpoint(request, userId, newTodo){
    const response = await request.post(`${USERS}/${userId}/${TODOS}`, {data: newTodo});
    const todo = await response.json();
    return {response, todo};
}
    

//--------------data helpers for users----------------------------

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
 //--------------------data helpers for todos--------------------

 export function createTodoWithoutStatus(userId){
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return {
        user_id: userId,
        title: faker.lorem.sentence(),
        due_on: dueDate.toISOString(),
        //namerno izostavljen status
    }
 }
export function createTodo(userId){
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return {
        user_id: userId,
        title: faker.lorem.sentence(),
        due_on: dueDate.toISOString(),
        status: faker.helpers.arrayElement(["pending", "completed"])
    }
 }
export function createTodoWithoutUserId(){ //for user endpoint 
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 7);
    return {
        title: faker.lorem.sentence(),
        due_on: dueDate.toISOString(),
        status: faker.helpers.arrayElement(["pending", "completed"])
    }
 }