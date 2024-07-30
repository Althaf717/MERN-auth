import express from 'express'
import {signup,signin,google} from '../controllers/user.controller.js'
const router = express.Router()

router.post('/signup',signup)
router.post('/signin',signin)
router.post('/auth-google',google)

export default router 