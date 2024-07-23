import React from 'react'
import { Link } from 'react-router-dom'

const SignUp = () => {
  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-center text-3xl font-semibold my-7'>Sign Up</h1>
      <form className='flex flex-col gap-4'>
        <input type="text" placeholder='Username' id='username' className='bg-slate-100 rounded-lg p-3'/>
        <input type="email" placeholder='Email' id='email' className='bg-slate-100 rounded-lg p-3'/>
        <input type="password" placeholder='Password' id='password' className='bg-slate-100 rounded-lg p-3'/>
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>sign up</button>
      </form>
      <div className="flex mt-4 gap-2">
        <p>Have an Account?</p>
        <Link to="/sign-in">
          <span className='text-blue-500'>Sign In</span>
        </Link>
      </div>
    </div>
  )
}

export default SignUp