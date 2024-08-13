import express from 'express'
import {adminsignin,getUserData} from '../controllers/admin.controller.js'
const router = express.Router()
import { verifyToken } from '../utils/verifyUser.js';


router.post("/signin",adminsignin)
router.get("/users_data",verifyToken,getUserData)

export default router