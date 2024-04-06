import React, { useEffect, useState,useMemo, useRef } from "react";
import QuillEditor from "react-quill";
import parse from "html-react-parser";
import { useNavigate, useParams } from "react-router-dom";
import styles from "./styles.module.css";
import { Oval } from "react-loader-spinner";


import axios from "axios";
import Cookies from "js-cookie";
import "./singleBlog.css";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


const SingleBlog = () => {
  const [title, setTitle] = useState("");


  const modules = useMemo(
    () => ({
      
      toolbar: {
        container: [
          [{ header: [2, 3, 4, false] }],
          ["bold", "italic", "underline", "blockquote"],
          [{ color: [] }],
          [
            { list: "ordered" },
            { list: "bullet" },
            { indent: "-1" },
            { indent: "+1" },
          ],
          ["link", "image"],
        ],
        handlers: {
          // image: imageHandler,
        },
      },
      clipboard: {
        matchVisual: true,
      },
    }),
    []
  );

  const formats = [
    "header",
    "bold",
    "italic",
    "underline",
    "strike",
    "blockquote",
    "list",
    "bullet",
    "indent",
    "link",
    "image",
    "color",
  ];

  const quill = useRef()

  const { blogId } = useParams();
  const token = Cookies.get("token");
  const [value, setValue] = useState("");

  const [comment,setComment] = useState([])
  const [updateMode, setUpdateMode] = useState("");
  const [loading, setloading] = useState(false);


  const navigate = useNavigate()

  const { userData } = useSelector((store) => store.user);

  const handleDelete = async() =>{
    const newpost = {
      content:value,
      id:comment._id
    }
    try {
      const res = await axios.delete('http://localhost:5000/api/blogs/delete-images',{
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        data: newpost // Pass data as 'data' property
      })
      console.log(res.data)
      toast.success("Blog Deleted")
      navigate('/')
    } catch (error) {
      console.log(error)
    }

  }
  const handleUpdateComment = async() =>{
    if (!userData.isAdmin && !userData.isSuperAdmin) {
      toast.error("Sorry! You Are Not Admin");
      return;
    }
    setloading(true);
    const newPost = {
      username: comment.username,
      title:title,
      content: value,
      userPic: comment.userPic,
      id:comment._id
    };
    try {

      const res = await axios.put(
        "http://localhost:5000/api/blogs/update-images",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res.data)
      toast.success("Blog updated");
      console.log(res.data)

      const regex = /<body>(.*?)<\/body>/s;
      const match = res.data.htmlContent.match(regex);
      setTitle(res.data.title)
      setValue(match[1]);
      console.log(match[1])
      setComment(res.data)      
      setloading(false)
      setUpdateMode(false)
    } catch (error) {
      setloading(false)
      console.error("Error uploading images:", error);
      // Handle errors appropriately
    }

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
        // console.log(res.data);
        const regex = /<body>(.*?)<\/body>/s;
        const match = res.data.htmlContent.match(regex);
        setTitle(res.data.title)
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
        {updateMode ? (
           <input
           type="text"
           placeholder="Title"
           className="writeInput"
           value={title}
           disabled={!userData.isAdmin && !userData.isSuperAdmin}
           autoFocus={true}
           onChange={(e) => setTitle(e.target.value)}
         />
        ) : (
          <h1 className="Blogtitle">{title}</h1>
        )}
       


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
                        setUpdateMode(!updateMode);
                      }}
                    ></i>
                    {!updateMode && <i
                      className="singlePostIcon fa-regular fa-trash-can"
                      onClick={() => handleDelete(comment._id)}
                    ></i>}
                    
                  </span>
                )}
                
              </div>
             
            </div>
          </div>

          {loading && (
          <span>
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </span>
        )}

          {updateMode ? (
          <QuillEditor
          ref={(el) => (quill.current = el)}
          className={styles.editor}
          theme="snow"
          value={value}
          formats={formats}
          modules={modules}
          onChange={(value) => setValue(value)}
        />
        ) : (
          <>{parse(value)}</>
          )}
        {updateMode && (
          
          <button onClick={handleUpdateComment} className="updateCommentButton">
          update
        </button>
        )}

      </div>
    </div>
  );
};

export default SingleBlog;
