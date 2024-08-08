import express from 'express'
import {signup,signin,google,signout,deleteUser,updateUser} from '../controllers/user.controller.js'
const router = express.Router()
import { verifyToken } from '../utils/verifyUser.js';

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/auth-google',google)
router.post('/signout',signout)
router.post('/update/:id', verifyToken, updateUser);
router.delete('/delete/:id', verifyToken, deleteUser);

export default router 