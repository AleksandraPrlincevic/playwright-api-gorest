import { test as base} from '@playwright/test';
import * as apiHelper from './apiHelper.js';

export const test = base.extend({
    createdUser: async({request}, use)=>{
        const newUser = apiHelper.generateNewUser();
        const { response, createdUser } = await apiHelper.createNewUser(request, newUser);
        await use ({response, newUser, createdUser});
        await apiHelper.deleteUser(request, createdUser.id);
    },
});