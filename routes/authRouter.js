import express from 'express'
import { createUser, login } from '../controller/authController';
const authRouter=express.Router();

authRouter.post('/auth/create',createUser)
authRouter.post('/auth/login',login)

export default authRouter