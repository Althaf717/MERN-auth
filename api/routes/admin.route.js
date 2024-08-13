import express from 'express'
import {adminsignin,getUserData,getUserDataById,deleteUserById} from '../controllers/admin.controller.js'
const router = express.Router()
import { verifyToken } from '../utils/verifyUser.js';


router.post("/signin",adminsignin)
router.get("/users_data",verifyToken,getUserData)
router.get('/user/:id',verifyToken,getUserDataById);
router.delete('/delete_user/:id',verifyToken,deleteUserById);

export default router