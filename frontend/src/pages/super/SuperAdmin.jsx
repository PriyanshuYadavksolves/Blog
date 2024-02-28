import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./super.css";

const SuperAdmin = () => {
  const location = useLocation();
  const [users, setUsers] = useState([]);
  const id = location.pathname.split("/")[2];

  const handleCheckboxChange = async (id, isAdmin) => {
    try {
      await axios.put("http://localhost:8000/api/super/" + id, {
        isAdmin,
      });
      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === id ? { ...user, isAdmin: !user.isAdmin } : user
        )
      );
      if(isAdmin){
        toast.error("Removed from Admin Role")
      }else{
        toast.success('user is Admin Now')
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      const res = await axios.delete("http://localhost:8000/api/super/" + id);
      console.log(res.data);
      setUsers((prevUsers) => prevUsers.filter((user) => user._id !== id));
      toast.success("user deleted Successfully");
    } catch (error) {
      toast.error("something went wrong");
      console.log(error);
    }
  };

  const fetchUsers = async () => {
    try {
      const res = await axios.post("http://localhost:8000/api/super/allUser", {
        id,
      });
      setUsers(res.data);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div className="center">
      <h1>All Users</h1>
      <ul className="ul">
        {users.map((user) => (
          <>
            {!user.isSuperAdmin && (
              <li className="li" key={user._id}>
                <img
                  className="img"
                  src={user.profilePic}
                  alt={user.username}
                />
                <span className="username">{user.username}</span>
                <span className="email">{user.email}</span>
                <input
                  className="input"
                  type="checkbox"
                  checked={user.isAdmin}
                  onChange={() => handleCheckboxChange(user._id, user.isAdmin)}
                />

                <i
                  className="singlePostIcon fa-regular fa-trash-can"
                  onClick={() => handleDelete(user._id)} // Pass user id to handleDelete function
                ></i>
              </li>
            )}
          </>
        ))}
      </ul>
    </div>
  );
};

export default SuperAdmin;
