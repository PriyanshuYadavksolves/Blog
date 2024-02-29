import axios from "axios";
import React, { useEffect, useState } from "react";
import "./single.css";
import { useNavigate, useParams } from "react-router-dom";

const Single = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [imageUrl, setImageUrl] = useState("");
  const [desc, setDesc] = useState("");
  const [title, setTitle] = useState("");
  const [updateMode, setUpdateMode] = useState(false);
  const [statusMsg, setStatusMsg] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `http://localhost:8000/api/blog/getOne/${id}`
        );
        setImageUrl(res.data.photo);
        setDesc(res.data.desc);
        setTitle(res.data.title);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, [id]);

  const handleDelete = async () => {
    await axios.delete(`http://localhost:8000/api/blog/deleteBlog/${id}`);
    alert("delete successfully");
    navigate("/home");
  };

  const handleUpdate = async () => {
    try {
      setIsLoading(true);
      setStatusMsg("loading...");
      const response = await axios.patch(
        `http://localhost:8000/api/blog/updateBlog/${id}`,
        { title,desc }
      );
      if (response.data) {
        setStatusMsg("Data Updated");
        setTimeout(() => {
          setStatusMsg(null);
          setUpdateMode(false);
          setIsLoading(false);
        }, 2000);
      }
    } catch (error) {
      console.log(error);
      setStatusMsg("Error...");
      setTimeout(() => {
        setStatusMsg(null);
        setUpdateMode(false);
        setIsLoading(false);
      }, 3000);
    }
  };

  return (
    <div className="desc-window">
      {updateMode ? (
        <h1 className="btn" onClick={() => setUpdateMode(false)}>
          Cancel
        </h1>
      ) : (
        <h1 className="btn" onClick={() => navigate("/home")}>
          Go Back
        </h1>
      )}

      <div className="center">
        <img className="desc-img" src={imageUrl} alt="" />

        <div className="desc-brake">
          {updateMode ? (
            <input
              className="desc-input-title"
              type="text"
              value={title}
              autoFocus
              onChange={(e) => setTitle(e.target.value)}
              disabled={isLoading}
            />
          ) : (
            <p className="title">{title}</p>
          )}

          {updateMode ? (
            <button
            className="edit"
            onClick={handleUpdate}
            disabled={isLoading}
          >
            Update
          </button>
          ) : (
            <>
              <i
              className="singlePostIcon fa-regular fa-pen-to-square"
              onClick={() => setUpdateMode(true)}
            ></i>
            <i
              className="singlePostIcon fa-regular fa-trash-can"
              onClick={handleDelete}
              ></i>
              </>
          )}
        </div>
        {statusMsg && <span>{statusMsg}</span>}

        {updateMode ? (
          <textarea
            className="desc-desc"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            disabled={isLoading}
          />
        ) : (
          <p className="desc-desc-p">{desc}</p>
        )}
      </div>
    </div>
  );
};

export default Single;
