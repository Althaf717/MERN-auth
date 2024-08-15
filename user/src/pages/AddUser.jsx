import React, { useState, useRef, useEffect} from "react";
import axios from "../axios";
import { useNavigate,Link } from "react-router-dom";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";

import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firabase";

const AddUser = () => {

  const [formData, setFormData] =  useState({});
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const [validateErrors, setValidateErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const fileRef = useRef();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  useEffect(() => {
    if (image) {
      handleFileUpload(image);
    }
  }, [image]);
  useEffect(()=>{
    console.log("formdata:",formData);
  },[formData])
  const handleFileUpload = async (image) => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + image.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, image);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setImagePercent(Math.round(progress));
      },
      (error) => {
        setImageError(true);
      },
      () => {
        setImageError(false);
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) =>
          setFormData({ ...formData, profilePicture: downloadURL }),
        );
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate(formData);

    //console.log(formData.image)
    console.log(formData);
    if (Object.keys(formErrors).length == 0) {
        
        axios.post('/admin/add_user',formData,{withCredentials:true}).then((res)=>{
            toast.success(res.data)
            navigate('/admin/dashboard')
        }).catch((err)=>{
            toast.error(err.response?err.response.data: err.message);
        })
    }
  };

  const validate = (formDatas) => {
    const formErrors = {};
    if (!formDatas.email || formDatas.email.trim() === "") {
      formErrors.email = "Enter your Email address";
    }
    if (!formDatas.username || formDatas.username.trim() === "") {
      formErrors.username = "Enter your Username";
    }
    if (!formDatas.password || formDatas.password.trim() === "") {
      formErrors.password = "Please enter your Password";
    }
    setValidateErrors(formErrors);
    return formErrors;
  };


  return (
    <>
      <div className=" w-full mt-6  mx-auto h-[420px] sm:w-[450px]">
        <h1 className="text-center  text-2xl font-semibold my-6">Add User</h1>

        <form onSubmit={handleSubmit}>
          <div className=" mx-5 mt-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
              style={validateErrors.username && { color: "rgb(194 65 12)" }}
            >
              {validateErrors.username ? validateErrors.username : "Name"}
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="username"
                name="username"
                type="text"
                autoComplete="name"
                style={validateErrors.username && { borderColor: "rgb(194 65 12)" }}
                placeholder="Enter User Name"
                className="w-full bg-[#ffffff0f] border-1 border-slate-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
              />
            </div>
          </div>
          <div className=" mx-5 mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
              style={validateErrors.email && { color: "rgb(194 65 12)" }}
            >
              {validateErrors.email ? validateErrors.email : "Email address"}
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                style={
                  validateErrors.email && { borderColor: "rgb(194 65 12)" }
                }
                placeholder="Enter email"
                className="w-full bg-[#ffffff0f] border-1 border-slate-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
              />
            </div>
          </div>
          <div className=" mx-5 mt-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium leading-6"
              style={validateErrors.password && { color: "rgb(194 65 12)" }}
            >
              {validateErrors?.password ? validateErrors.password : "Password"}
            </label>
            <div className="mt-2">
              <input
                onChange={handleChange}
                id="password"
                name="password"
                type="password"
                autoComplete="password"
                style={
                  validateErrors.password && { borderColor: "rgb(194 65 12)" }
                }
                placeholder="Enter Password"
                className="w-full bg-[#ffffff0f] border-1 border-slate-500 px-4 py-2 border rounded-md focus:outline-none  focus:ring-1 focus:border-blue-500"
              />
            </div>
            <label
              htmlFor="email"
              className="block mt-2 text-sm font-medium leading-6"
            >
              User Profile Photo
            </label>
            <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
            <button
              onClick={() => fileRef.current.click()}
              type="button"
              className="mt-2 w-full text-white bg-gray-800 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700text-white bg-gradient-to-r from-purple-500 to-pink-500 hover:bg-gradient-to-l focus:ring-4 focus:outline-none focus:ring-purple-200 dark:focus:ring-purple-800 font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
            >
              Tap to add Profile Photo
            </button>
            <p className="text-sm self-center ml-6">
              {imageError ? (
                <span className="text-red-700">
                  Error uploading image (file size must be less than 2 MB)
                </span>
              ) : imagePercent > 0 && imagePercent < 100 ? (
                <span className="text-slate-700">{`Uploading: ${imagePercent} %`}</span>
              ) : imagePercent === 100 ? (
                <span className="text-green-700 ">
                  Image uploaded successfully
                </span>
              ) : (
                ""
              )}
            </p>
            {loading ? (
              <button
                disabled
                className="my-6 w-full rounded-md  bg-slate-700 px-11 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600"
              >
                <ClipLoader color="white" size={13} className="mx-1" /> SIGN UP
              </button>
            ) : (
              <button className="my-6 w-full rounded-md  bg-slate-700 px-11 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-slate-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-600">
                {" "}
                SIGN UP
              </button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default AddUser;