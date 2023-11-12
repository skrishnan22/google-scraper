import express from 'express';
import UserController from './user.controller.js';

export const router = express.Router();
export const path = 'user';
const userController = new UserController();

router.post('/sign-up', userController.createUser.bind(this));
