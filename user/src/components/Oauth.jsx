import React from 'react'
import {getAuth, GoogleAuthProvider, signInWithPopup} from 'firebase/auth'
import { app } from '../firabase'
import axios from "../axios.js";
import { useDispatch } from "react-redux";
import { signInSuccess } from '../redux/user/userSlice.js';

const Oauth = () => {
    const dispatch = useDispatch();
    const handleGoogleClick = async () =>{
        try {
            const provider = new GoogleAuthProvider()
            const auth = getAuth(app)
            const result = await signInWithPopup(auth,provider)
            const response = await axios.post('/user/auth-google',{
                name:result.user.displayName,
                email:result.user.email,
                photo:result.user.photoURL
            },{withCredentials:true})
            dispatch(signInSuccess(response.data))
        } catch (error) {
            console.log("google auth error",error);
        }
    }
  return (
    <button type='button' onClick={handleGoogleClick} className='bg-red-700 text-white rounded-lg p-3 uppercase hover:opacity-95'>
        continue with google
    </button>
  )
}

export default Oauth