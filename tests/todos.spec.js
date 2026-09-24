import { test } from '../utils/fixtures.js';
import { expect } from '@playwright/test';
import * as apiHelper from '../utils/apiHelper.js';
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
});
 test ('canNot create a todo without status property', async({userFixture, request})=>{
    const {createdUser} = userFixture;
    const userId = createdUser.id;
   
    const newTodo = apiHelper.generateTodoWithoutStatus(userId);
    const {response: response2, todo} = await apiHelper.createNewTodo(request, newTodo);
    
    expect(response2.status()).toBe(422);
    expect(todo[0].field).toContain("status");
    expect(todo[0].message).toContain("can't be blank");
 });

 test ('can create a todo', async ({userFixture, request})=>{
    const {createdUser} = userFixture;
    const userId = createdUser.id;

    const newTodo = apiHelper.generateTodo(userId);
    const {response, todo: createdTodo} = await apiHelper.createNewTodo(request, newTodo);
    
    expect(response.status()).toBe(201);
    expect(createdTodo.user_id).toEqual(userId);
    expect(createdTodo.title).toEqual(newTodo.title);
    expect(new Date(createdTodo.due_on).getTime()).toEqual(new Date(newTodo.due_on).getTime());
    expect(createdTodo.status).toBe(newTodo.status);
    expect(createdTodo.id).toBeGreaterThan(0);
    
    const {todos} = await apiHelper.getAllTodos(request);
    expect(todos.some(t => t.id === createdTodo.id)).toBe(true);

    await apiHelper.deleteTodo(request, createdTodo.id)
   });

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
      });
   });
   test (`can create a todo via user endpoint`, async ({userFixture, request})=>{ 
      const {createdUser} = userFixture;
      const userId = createdUser.id;

      const newTodo = apiHelper.generateTodoWithoutUserId();
      const {response, todo} = await apiHelper. createTodoViaUserEndpoint(request, userId, newTodo);
     
      expect(response.status()).toBe(201);
      expect(todo.user_id).toEqual(userId);
      expect(todo.title).toEqual(newTodo.title);
      expect(new Date(todo.due_on).getTime()).toEqual(new Date(newTodo.due_on).getTime());
      expect(todo.status).toBe(newTodo.status);
      expect(todo.id).toBeGreaterThan(0);
    
      const {todos} = await apiHelper.getAllTodos(request);
      expect(todos.some(t => t.id === todo.id)).toBe(true);
      await apiHelper.deleteTodo(request, todo.id);
   });
   test('canNot create a todo with invalid user id', async({request})=>{
     const userId = 99999999999;
     const newTodo = apiHelper.generateTodo(userId);

     const {response, todo: responseBody} = await apiHelper.createNewTodo(request, newTodo); 
      expect(response.status()).toBe(422);
      expect(responseBody[0].field).toContain("user");
      expect(responseBody[0].message).toContain("must exist");
   });
   test (`canNot create a todo with invalid status`, async ({userFixture, request})=>{  //via user endpoint
      const {createdUser} = userFixture;
      const userId = createdUser.id;

      const newTodo = apiHelper.generateTodoWithoutUserId();
      newTodo.status = "invalid";
      const {response, todo} = await apiHelper. createTodoViaUserEndpoint(request, userId, newTodo);

      expect(response.status()).toBe(422);
      expect(todo[0].field).toContain("status");
      expect(todo[0].message).toContain("can't be blank, can be pending or completed");
   });
 

 test( 'can delete a todo', async ({userFixture, todoFixture, request})=>{
   const {createdUser} = userFixture;
   const userId = createdUser.id;

   const {response, createdTodo} = todoFixture;
   const todoId = createdTodo.id;
   
   expect(response.status()).toBe(201);
   expect(createdTodo.user_id).toEqual(userId);
   expect(createdTodo.id).toBeGreaterThan(0);

   const {response: response2} = await apiHelper.deleteTodo(request, todoId);

   expect(response2.status()).toBe(204);
     
   const {todos: todos2} = await apiHelper.getAllTodos(request);
      todos2.forEach(todo=>{
      expect(todo.id).not.toBe(todoId);
   });
 });
test('can patch a todo', async({todoFixture, request})=>{
   const {response, createdTodo} = todoFixture;
   const todoId = createdTodo.id;
   
   expect(response.status()).toBe(201);
   expect(createdTodo.id).toBeGreaterThan(0);

   const data = apiHelper.changeTodoStatus(createdTodo);
   const {response: response2, todo: changedTodo } = await apiHelper.patchTodo(request, todoId, data);

   expect(response2.status()).toBe(200);
   expect(changedTodo.status).not.toEqual(createdTodo.status);
   expect(changedTodo.id).toEqual(createdTodo.id);
   expect(changedTodo.user_id).toEqual(createdTodo.user_id);
   expect(changedTodo.title).toEqual(createdTodo.title);
   expect(changedTodo.due_on).toEqual(createdTodo.due_on);
});

 test('canNot replace a todo with invalid todo id', async({userFixture, request})=>{
   const {createdUser} = userFixture;
   const userId = createdUser.id;

   const newTodo = apiHelper.generateTodo(userId);
   const invalidTodoId = 99999999999;

   const {response:response2, todo: responseBody} = await apiHelper.changeTodo(request, invalidTodoId, newTodo); 
   expect(response2.status()).toBe(404);
   expect(responseBody.message).toContain("Resource not found");
});
   