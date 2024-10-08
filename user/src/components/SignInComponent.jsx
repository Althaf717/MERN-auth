import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import {
  signInStart,
  signInSuccess,
  signInFailure,
} from "../redux/user/userSlice";
import { useDispatch, useSelector } from "react-redux";
import Oauth from "./Oauth";

const SignInComponent = ({ admin }) => {
  const [formData, setFormData] = useState({});
  const [validateErrors, setValidateErrors] = useState({});
  const { loading, error } = useSelector((state) => state.user);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate(formData);
    if (Object.keys(formErrors).length == 0) {
      dispatch(signInStart());
      try {
        const response = await axios.post(
          "/user/signin",
          {
            email: formData.email,
            password: formData.password,
          },
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        toast.success("Sign In success!");
        setTimeout(() => {
          dispatch(signInSuccess(data));
          navigate("/");
        }, 2000);
      } catch (err) {
        dispatch(signInFailure(err));
        toast.error(err.response?.data?.message || "An error occurred");
      }
    }
  };

  const handleAdminSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate(formData);
    if (Object.keys(formErrors).length == 0) {
      dispatch(signInStart());
      try {
        const response = await axios.post(
          "/admin/signin",
          formData,
          {
            withCredentials: true,
          }
        );
        const data = response.data;
        console.log(data);
        toast.success("Sign In success!");
        setTimeout(() => {
          dispatch(signInSuccess(data));
          navigate("/admin/dashboard");
        }, 2000);
      } catch (err) {
        dispatch(signInFailure(err));
        toast.error(err.response?.data?.message || "An error occurred");
      }
    }
  };

  const validate = (formDatas) => {
    const formErrors = {};
    if (!formDatas.email || formDatas.email.trim() === "") {
      formErrors.email = "Enter your Email address";
    }
    if (!formDatas.password || formDatas.password.trim() === "") {
      formErrors.password = "Please enter your Password";
    }
    setValidateErrors(formErrors);
    return formErrors;
  };

  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">
        {admin ? "Admin Sign In" : "Sign In"}
      </h1>
      <form
        onSubmit={admin ? handleAdminSubmit : handleSubmit}
        className="flex flex-col gap-4"
      >
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6"
          style={validateErrors.email && { color: "rgb(194 65 12)" }}
        >
          {validateErrors.email ? validateErrors.email : "Email address"}
        </label>
        <input
          type="email"
          placeholder="Email"
          id="email"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          style={validateErrors.email && { borderColor: "rgb(194 65 12)" }}
        />
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6"
          style={validateErrors.password && { color: "rgb(194 65 12)" }}
        >
          {validateErrors?.password ? validateErrors.password : "Password"}
        </label>
        <input
          type="password"
          placeholder="Password"
          id="password"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          style={validateErrors.password && { color: "rgb(194 65 12)" }}
        />
        {loading ? (
          <button
            disabled
            className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80"
          >
            <ClipLoader color="white" size={13} className="mx-1" /> sign in
          </button>
        ) : (
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {" "}
            sign in
          </button>
        )}
        {admin ? null : <Oauth />}
      </form>
      {admin ? null : (
        <div className="flex mt-4 gap-2">
          <p>Dont have an Account?</p>
          <Link to="/sign-up">
            <span className="text-blue-500">Sign Up</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default SignInComponent;
