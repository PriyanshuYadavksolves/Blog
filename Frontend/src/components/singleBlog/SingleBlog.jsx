import React, { useEffect, useState } from "react";
import parse from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";
import "./singleBlog.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SingleBlog = () => {
  const { blogId } = useParams();
  const token = Cookies.get("token");
  const [value, setValue] = useState("");
  const [content,setContent] = useState('')

  const [comment,setComment] = useState([])
  const [updateMode, setUpdateMode] = useState("");
  const [updateComment, setUpdateComment] = useState("");
  const [editComment, setEditComment] = useState(null); 
  const navigate = useNavigate()

  const { userData } = useSelector((store) => store.user);

  const handleDelete = async() =>{
    const newpost = {
      content,
      id:comment._id
    }
    console.log(newpost)
    try {
      const res = await axios.post('http://localhost:5000/api/delete-images',newpost)
      console.log(res.data)
      toast.success("Blog Deleted")
      navigate('/')
    } catch (error) {
      console.log(error)
    }

  }
  const handleUpdateComment = async() =>{
  

  }


  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/blogs/" + blogId,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log(res.data);
        setContent(res.data.htmlContent)
        const regex = /<body>(.*?)<\/body>/s;
        const match = res.data.htmlContent.match(regex);
        setValue(match[1]);
        setComment(res.data)
      } catch (error) {
        console.log(error);
      }
    };
    fetchBlog();
  }, []);

  return (
    <div className="singleblogWrapper">
      <div className="desc">
        <h1>{comment.title}</h1>


        <div key={comment._id} className="commentItem">
            <div className="commentimg">
              <img className="topImg" src={comment.userPic} alt="" />
            </div>
            <div className="commentcenter">
              <div className="com">
                <span className="commentusername">{comment.username}</span>
                <span className="commentdate">
                  {new Date(comment.createdAt).toDateString()}
                </span>
                {(userData?.isSuperAdmin ||
                  (comment.username === userData?.username &&
                    userData?.isAdmin)) && (
                  <span className="singlePostEdit">
                    <i
                      className="singlePostIcon fa-regular fa-pen-to-square"
                      onClick={() => {
                        setUpdateMode(true);
                        setEditComment(comment);
                        setUpdateComment(comment.content)
                      }}
                    ></i>
                    <i
                      className="singlePostIcon fa-regular fa-trash-can"
                      onClick={() => handleDelete(comment._id)}
                    ></i>
                  </span>
                )}
              </div>
             
            </div>
          </div>

        <>{parse(value)}</>
      </div>
    </div>
  );
};

export default SingleBlog;
