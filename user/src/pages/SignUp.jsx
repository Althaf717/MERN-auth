import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../axios";
import { toast } from "react-toastify";
import { ClipLoader } from "react-spinners";
import Oauth from "../components/Oauth";




const SignUp = () => {
  const [formData, setFormData] = useState({});
  const [validateErrors, setValidateErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formErrors = validate(formData);
    if (Object.keys(formErrors).length == 0) {
      setLoading(true);
      try {
        const response = await axios.post("/user/signup", {
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        const data = await response.data
        console.log("12345"+JSON.stringify(data));
        if (response.data.message == "create successfully") {
          toast.success("Sign Up success!");
          setTimeout(() => {
            setLoading(false);
            navigate("/sign-in");
          }, 2000);
        }
        
      } catch (err) {
        console.log(err);
        setLoading(false);
        // toast.error(err.response.data);
        toast.error(err.response?.data?.message || "An error occurred");
      }
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
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-center text-3xl font-semibold my-7">Sign Up</h1>
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <label
          htmlFor="email"
          className="block text-sm font-medium leading-6"
          style={validateErrors.username && { color: "rgb(194 65 12)" }}
        >
          {validateErrors.username ? validateErrors.username : "Name"}
        </label>
        <input
          type="text"
          placeholder="Username"
          id="username"
          className="bg-slate-100 rounded-lg p-3"
          onChange={handleChange}
          style={validateErrors.username && { color: "rgb(194 65 12)" }}
        />
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
            <ClipLoader color="white" size={13} className="mx-1" /> sign up
          </button>
        ) : (
          <button className="bg-slate-700 text-white p-3 rounded-lg uppercase hover:opacity-95 disabled:opacity-80">
            {" "}
            sign up
          </button>
        )}
        <Oauth/>
      </form>
      <div className="flex mt-4 gap-2">
        <p>Have an Account?</p>
        <Link to="/sign-in">
          <span className="text-blue-500">Sign In</span>
        </Link>
      </div>
      {/* <p className="text-red-700 mt-5">{error&&'Credential Already Exist!'}</p> */}
    </div>
  );
};

export default SignUp;


