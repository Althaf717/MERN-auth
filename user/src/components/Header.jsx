import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux"; 

const Header = () => {
  const {currentUser} = useSelector(state=>state.user)
  return (
    <div className="bg-gray-400">
      <div className="flex justify-between p-3 max-w-6xl mx-auto items-center">
      <Link to={currentUser?.__v === 1 ? "/admin/dashboard" : "/"}>
  <h1 className="font-bold">
    {currentUser?.__v === 1 ? "Admin" : "Auth app"}
  </h1>
</Link>
        <ul className="flex gap-4">
          <Link to={currentUser?.__v === 1 ? "/admin/add_user" : "/"}>
            <li>{currentUser?.__v === 1 ? "Add User" : "Home"}</li>
          </Link>
          <Link to={currentUser?.__v === 1 ? "" : "/about"}>
            <li>{currentUser?.__v === 1 ? "" : "About"}</li>
          </Link>
          <Link to="/profile">
            {currentUser ? (
              <img src={currentUser.profilePicture} alt="profile" className="h-7 w-7 rounded-full object-cover" />
            ) : (
              <li>Sign In</li>
            )}
          </Link>
        </ul>
      </div>
    </div>
  );
};

export default Header;
