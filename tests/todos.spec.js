import { test, expect } from '@playwright/test';
import{USERS, POSTS, TODOS} from '../utils/endpoints';
import * as apiHelper from '../utils/apiHelper';
import { faker } from '@faker-js/faker';
import 'dotenv/config';

test ('can get all todos', async ({request})=>{
   const {response, todos} = await apiHelper.getAllTodos(request);

   expect(response.status()).toBe(200);
   expect(Array.isArray(todos)).toBe(true);
   expect(todos.length).toBeGreaterThan(0);

   todos.forEach(todo=>{
     expect(todo).toHaveProperty('user_id');
     expect(todo).toHaveProperty('id');
     expect(todo).toHaveProperty('title');
     expect(todo).toHaveProperty('due_on');
     expect(todo).toHaveProperty('status');
   });
})
 test ('canNot create a todo without status property', async({request})=>{
    const {users} = await apiHelper.getAllUsers(request);
    const randomUser = apiHelper.getRandomUser(users);
    const userId = randomUser.id;
   
    const newTodo = apiHelper.createTodoWithoutStatus(userId);
    const {response: response2, todo} = await apiHelper.createNewTodo(request, newTodo);
    
    expect(response2.status()).toBe(422);
    expect(todo[0].field).toContain("status");
    expect(todo[0].message).toContain("can't be blank");
 })

 test ('can create a todo', async ({request})=>{
    const {users} = await apiHelper.getAllUsers(request);
    const randomUser = apiHelper.getRandomUser(users);
    const userId = randomUser.id;

    const newTodo = apiHelper.createTodo(userId);
    const {response, todo} = await apiHelper.createNewTodo(request, newTodo);

    expect(response.status()).toBe(201);
    expect(todo.user_id).toEqual(userId);
    expect(todo.title).toEqual(newTodo.title);
    expect(new Date(todo.due_on).getTime()).toEqual(new Date(newTodo.due_on).getTime());
    expect(todo.status).toBe(newTodo.status);
    expect(todo.id).toBeGreaterThan(0);
    })

    test ('can get all todos from one user', async ({request})=>{
      const {todos} = await apiHelper.getAllTodos(request); 
      expect(todos.length).toBeGreaterThan(0);
      const userId = todos[0].user_id;
      const {response, usersTodos} =  await apiHelper.getAllTodosFromOneUser(request, userId);
      expect(response.status()).toBe(200);
      expect(Array.isArray(usersTodos)).toBe(true);
      expect(usersTodos.length).toBeGreaterThan(0);
      usersTodos.forEach(todo=>{
         expect(todo.user_id).toEqual(userId);
      })
    })

   test (`canNot create a todo with invalid status`, async ({request})=>{
      const {users} = await apiHelper.getAllUsers(request);
      const randomUser = apiHelper.getRandomUser(users);
      const userId = randomUser.id;
      const newTodo = apiHelper.createTodoWithoutUserId();
      newTodo.status = "invalid";
      const {response, todo} = await apiHelper. createTodoViaUserEndpoint(request, userId, newTodo);

      expect(response.status()).toBe(422);
      expect(todo[0].field).toContain("status");
      expect(todo[0].message).toContain("can't be blank, can be pending or completed");
 } )