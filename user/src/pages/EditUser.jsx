import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-toastify";
import Button from "@mui/material/Button";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { ClipLoader } from "react-spinners";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import { app } from "../firabase";

const EditUser = () => {
  const fileRef = useRef();
  const [image, setImage] = useState(undefined);
  const [imagePercent, setImagePercent] = useState(0);
  const [imageError, setImageError] = useState(false);
  const userId = useParams();
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState({});
  const [isBtnDisabled, setIsBtnDisabled] = useState(true);

  const [formData, setFormData] = useState({});
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
          setIsBtnDisabled(false)
        );
      }
    );
  };
  const handleChange = (e) => {
    setIsBtnDisabled(false);
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const navigate = useNavigate();
  useEffect(() => {
    axios
      .get(`/admin/user/${userId.id}`, { withCredentials: true })
      .then((res) => {
        setUser(res.data);
      })
      .catch((err) => {
        toast.error(err.response.data || err.message);
      });
  }, []);

  const handleSubmit = (e) => {
    setLoading(true);
    e.preventDefault();
    //console.log(user._id);
    axios
      .put(`/admin/edit_user/${userId.id}`, formData, { withCredentials: true })
      .then((res) => {
        setTimeout(() => {
          setLoading(false);
          setUser(res.data);
          toast.success("Updated successfully");
        }, 1000).catch((err) => {
          toast.error(err.response.data || err.message);
        });
      });
  };

  return (
    <div className="m-4 sm:mx-5  md:mx-12 mt-12">
      <Button
        onClick={() => navigate("/admin/dashboard")}
        variant="text"
        color="info"
        startIcon={<ArrowBackIcon />}
      >
        Dashboard
      </Button>
      <div className=" w-full sm:w-full md:w-full  mt-10">
        <div className="flex  flex-wrap justify-center">
          <div className="h-60 m-2 w-full sm:w-60 ">
            {
              <img
                className="object-cover h-60 min-w-60 mx-auto rounded-md cursor-pointer"
                src={formData.profilePicture || user.profilePicture}
                alt="profilepicture"
                onClick={() => fileRef.current.click()}
              />
            }
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
          </div>
          <div className="h-60 m-2  w-full sm:w-96 ">
            <form onSubmit={handleSubmit}>
              <input
                type="file"
                ref={fileRef}
                hidden
                accept="image/*"
                onChange={(e) => setImage(e.target.files[0])}
              />
              <div className="">
                <input
                  id="username"
                  name="username"
                  type="text"
                  defaultValue={user.username}
                  onChange={handleChange}
                  placeholder="Username"
                  className="w-full bg-[#ffffff0f] border-1 border-slate-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
                />
              </div>
              <div className="my-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                  defaultValue={user.email}
                  onChange={handleChange}
                  placeholder="Email"
                  className="w-full bg-[#ffffff0f] border-1 border-slate-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
                />
              </div>
              <div className="my-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-[#ffffff0f] border-1 border-slate-500 px-4 py-2 border rounded-md focus:outline-none focus:ring-1 focus:border-blue-500"
                />
              </div>
              {loading ? (
                <button
                  disabled
                  type=""
                  className="my-6 w-full rounded-md  bg-indigo-700 px-11 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  {" "}
                  <ClipLoader color="white" size={13} className="mx-1" />{" "}
                  Loading...
                </button>
              ) : (
                <button
                  disabled={isBtnDisabled ? true : false}
                  type="submit"
                  className="my-6 disabled:bg-opacity-55 disabled:cursor-not-allowed  mb-4 w-full rounded-md bg-indigo-700 px-11 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                >
                  Update Profile
                </button>
              )}
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditUser;
