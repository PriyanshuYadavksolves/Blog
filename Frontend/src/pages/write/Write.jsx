import { useState } from "react";
import "./write.css";
import axios from "axios";

import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function Write() {
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const [desc, setDesc] = useState("");
  const [file, setFile] = useState(null);
  const { userData } = useSelector((store) => store.user);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!userData.isAdmin && !userData.isSuperAdmin) {
      toast.error("Sorry! You Are Not Admin");
      return;
    }
    const newPost = {
      username: userData.username,
      title,
      desc,
    };
    if (file) {
      newPost.image = file;
    } else {
      toast.warning("Photo Not Uploaded");
      return;
    }
    try {
      const res = await axios.post(
        "http://localhost:5000/api/posts",
        newPost,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      toast.success("Blog Created");
      navigate("/post/" + res.data._id);
    } catch (err) {
      console.log(err);
      toast.error("Something Went Wrong");
    }
  };

  return (
    <div className="write">
      {file && (
        <img
          className="writeImg"
          src={URL.createObjectURL(file)}
          alt="Uploaded"
        />
      )}
      <form className="writeForm" onSubmit={handleSubmit}>
        <div className="writeFormGroup">
          <label htmlFor="fileInput" className="uploadLabel">
            <i className="writeIcon fas fa-image"></i>
            <span className="uploadText">
              Click here to upload an image
            </span>
          </label>
          <input
            type="file"
            id="fileInput"
            disabled={!userData.isAdmin && !userData.isSuperAdmin}
            style={{ display: "none" }}
            onChange={(e) => setFile(e.target.files[0])}
          />
          <input
            type="text"
            placeholder="Title"
            className="writeInput"
            required
            disabled={!userData.isAdmin && !userData.isSuperAdmin}
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div className="writeFormGroup">
          <textarea
            placeholder="Tell your story"
            type="text"
            className="writeInput writeText"
            required
            disabled={!userData.isAdmin && !userData.isSuperAdmin}
            onChange={(e) => setDesc(e.target.value)}
          ></textarea>
        </div>
        <button className="writeSubmit" type="submit">
          Publish
        </button>
      </form>
    </div>
  );
}
