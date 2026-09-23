import { test as base} from '@playwright/test';
import * as apiHelper from './apiHelper.js';

export const test = base.extend({
    userFixture: async({request}, use)=>{
        const newUser = apiHelper.generateNewUser();
        const { response, createdUser } = await apiHelper.createNewUser(request, newUser);
        await use ({response, newUser, createdUser});
        await apiHelper.deleteUser(request, createdUser.id);
    },
    todoFixture: async({request, userFixture}, use)=>{
        const {createdUser} = userFixture;
        const newTodo = apiHelper.generateTodo(createdUser.id);
        
        const {response, todo: createdTodo} = await apiHelper.createNewTodo(request, newTodo);
        await use({response, newTodo, createdTodo});
        const deleteResults = await apiHelper.deleteTodo(request, createdTodo.id);
    }
});