// import React, { useState,useRef } from "react";
// import { useSelector,useDispatch } from "react-redux";
// import { ClipLoader } from "react-spinners";
// import { updateCurrentUser,signOut} from "../redux/user/userSlice";
// import {toast} from "react-toastify"
// import axios from "../axios";
// import {useNavigate} from 'react-router-dom'
// // import PersonIcon from '@mui/icons-material/Person';

// const Profile = () => {
//   const navigate = useNavigate();
//   const dispatch = useDispatch();
//   const { currentUser } = useSelector((state) => state.user);
//   const [loading,setLoading] = useState(false);
//   const [profile,setProfile] = useState(currentUser.profilePicture);
//   const [isBtnDisabled,setIsBtnDisabled] = useState(true);
//   const [formData,setFormData] = useState({});
//   const fileRef = useRef();

//   //Updation of Profile Photo
//   const handleChange = async(e) =>{
//     const selectedFile = e.target.files[0];
//     if (!selectedFile.type.startsWith('image/')) {
//       toast.error('Please select only image files.');
//       return;
//     }
//     setProfile(selectedFile);

//     if(selectedFile){
//       const formData = new FormData();
//       formData.append('image', selectedFile);

//       try{
//         const response = await axios.post('/user/upload',formData,{params:{id:currentUser._id}});
//         console.log(response.data);
//         dispatch(updateCurrentUser(response.data));
//         toast.success('Profile Picture updated successfully!')
//       }catch(err){
//         toast.error(err.response?err.response.data:err.message);
//         console.log('Error occured when uploading image :',err);
//       }
//     }
//   }


//   //Logout api handling
//   const handleLogout =async(e) =>{
//     e.preventDefault();
//     try{
//       const res = await axios.post('/user/logout',{},{withCredentials:true});
//       console.log(res.data);
//       dispatch(signOut())
//       toast.success('Logged Out');
//       navigate('/');
//     }catch(err){
//       toast.error(err.message);
//     }
//   }


//   //Profile form inputs handle change
//   const formHandleChange = (e) =>{
//     setIsBtnDisabled(false)
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   }

//   //Profile form handle submit
//   const handleSubmit = async(e) =>{
//     e.preventDefault();
//     setLoading(true);
//     // console.log(formData);
//     try{
//       const response = await axios.put('/user/profile',formData,{
//         withCredentials:true
//       })
//       console.log(response.data);
//       dispatch(updateCurrentUser(response.data));
//       setTimeout(()=>{
//         toast.success('Profile updated successfully!')
//         setLoading(false)
//       },1500);

//     }catch(err){
//       toast.error(err.response? err.response.data:err.message);
//     }
//   }


//   return (
//     <>
//       <div className='p-3 max-w-lg mx-auto'>
//         <h1 className='text-3xl font-semibold text-center my-7'>
//           Profile
//         </h1>
        
//         <div className="flex flex-col gap-4">
//           <input ref={fileRef} accept="image/*" onChange={handleChange} type="file" hidden  />
//           {currentUser.profilePicture?(<img
//             className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2"
//             src={currentUser.profilePicture}
//             alt="helooo"
//             onClick={()=>fileRef.current.click()}
//           />):(<div onClick={()=>fileRef.current.click()} className="h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2">
//               {/* <PersonIcon color="primary" /> */}
//           </div>)}
//           <div >
//             <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            
//               <input
//                 onChange={formHandleChange}
//                 id="name"
//                 name="name"
//                 type="text"
//                 defaultValue={currentUser.username}
//                 autoComplete="name"
//                 placeholder="Enter your email"
//                 className="bg-slate-100 rounded-lg p-3"
//               />
            
//               <input
//                 id="email"
//                 onChange={formHandleChange}
//                 name="email"
//                 type="email"
//                 defaultValue={currentUser.email}
//                 autoComplete="email"
//                 placeholder="Enter your email"
//                 className="bg-slate-100 rounded-lg p-3"
//               />
           
//               <input
//                 id="password"
//                 onChange={formHandleChange}
//                 name="password"
//                 type="password"
//                 autoComplete="password"
//                 placeholder="Password"
//                 className="bg-slate-100 rounded-lg p-3"
//               />
            
//             {loading ? (
//               <button
//                 disabled
//                 className="my-3 w-full rounded-md bg-indigo-700 px-11 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
//               >
//                 <ClipLoader color="white" size={13} className="mx-1" /> Update
//               </button>
//             ) : (
//               <button disabled={isBtnDisabled?true:false} className={`disabled:bg-opacity-55 disabled:cursor-not-allowed  my-3 w-full rounded-md bg-indigo-700 px-11 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600`}>
//                 {" "}
//                 Update
//               </button>
//             )}
//             <p onClick={handleLogout} className="cursor-pointer p-1 text-sm ml-auto bg-orange-700 w-32 hover:bg-opacity-85 rounded-md text-center" >Logout</p>
//             </form>
//           </div>
//         </div>
//       </div>
//     </>
//   );
// };

// export default Profile;




import { useSelector } from 'react-redux';
import { useRef, useState, useEffect } from 'react';
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
  } from 'firebase/storage';
import { app } from '../firabase';
import { useDispatch } from 'react-redux';
import axios from "../axios";
import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOut,
} from '../redux/user/userSlice';

export default function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const { currentUser, loading, error } = useSelector((state) => state.user);

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);

  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL })
        );
      }
    );
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const { data } = await axios.post(`/user/update/${currentUser._id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (data.success === false) {
        dispatch(updateUserFailure(data));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (error) {
      dispatch(updateUserFailure(error));
    }
  };

  const handleDeleteAccount = async () => {
    try {
      dispatch(deleteUserStart());
      const { data } = await axios.delete(`/user/delete/${currentUser._id}`);
      if (data.success === false) {
        dispatch(deleteUserFailure(data));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (error) {
      dispatch(deleteUserFailure(error));
    }
  };

  const handleSignOut = async () => {
    try {
      await axios.post('/auth/signout');
      dispatch(signOut());
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className='p-3 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7'>Profile</h1>
      <form onSubmit={handleSubmit} className='flex flex-col gap-4'>
        <input
          type='file'
          ref={fileRef}
          hidden
          accept='image/*'
          onChange={(e) => setImage(e.target.files[0])}
        />
        

       
        <img
          src={formData.profilePicture || currentUser.profilePicture}
          alt='profile'
          className='h-24 w-24 self-center cursor-pointer rounded-full object-cover mt-2'
          onClick={() => fileRef.current.click()}
        />
        <p className='text-sm self-center'>
          {imageError ? (
            <span className='text-red-700'>
              Error uploading image (file size must be less than 2 MB)
            </span>
          ) : imagePercent > 0 && imagePercent < 100 ? (
            <span className='text-slate-700'>{`Uploading: ${imagePercent} %`}</span>
          ) : imagePercent === 100 ? (
            <span className='text-green-700'>Image uploaded successfully</span>
          ) : (
            ''
          )}
        </p>
        <input
          defaultValue={currentUser.username}
          type='text'
          id='username'
          placeholder='Username'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          defaultValue={currentUser.email}
          type='email'
          id='email'
          placeholder='Email'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <input
          type='password'
          id='password'
          placeholder='Password'
          className='bg-slate-100 rounded-lg p-3'
          onChange={handleChange}
        />
        <button className='bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80'>
          {loading ? 'Loading...' : 'Update'}
        </button>
      </form>
      <div className='flex justify-between mt-5'>
        <span
          onClick={handleDeleteAccount}
          className='text-red-700 cursor-pointer'
        >
          Delete Account
        </span>
        <span onClick={handleSignOut} className='text-red-700 cursor-pointer'>
          Sign out
        </span>
      </div>
      <p className='text-red-700 mt-5'>{error && 'Something went wrong!'}</p>
      <p className='text-green-700 mt-5'>
        {updateSuccess && 'User is updated successfully!'}
      </p>
    </div>
  );
}
