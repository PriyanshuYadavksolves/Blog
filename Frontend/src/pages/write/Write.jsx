import { useMemo, useRef, useState } from "react";
import QuillEditor from "react-quill";
import "react-quill/dist/quill.snow.css";
import styles from "./styles.module.css";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { Oval } from "react-loader-spinner";

import Cookies from "js-cookie";
import './write.css'

const Write = () => {
  // Editor state
  const navigate = useNavigate();
  const [title, setTitle] = useState("");
  const { userData } = useSelector((store) => store.user);
  const [loading, setloading] = useState(false);

  const token = Cookies.get("token");

  const [value, setValue] = useState("");

  // Editor ref
  const quill = useRef();

  // Handler to handle button clicked
  async function handler() {
    if(title === ""){
      return toast.warning('title is not there')
    }
    if (!userData.isAdmin && !userData.isSuperAdmin) {
      toast.error("Sorry! You Are Not Admin");
      return;
    }
    setloading(true);
    const newPost = {
      username: userData.username,
      title:title,
      content: value,
      userPic: userData.profilePic
    };
    try {

      const res = await axios.post(
        "http://localhost:5000/api/blogs/upload-images",
        newPost,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      // console.log(res.data)
      toast.success("Blog Created");

      setValue(res.data.htmlContent); // Update the editor with the modified content
      setloading(false)
      navigate('/blog/'+res.data._id)
    } catch (error) {
      setloading(false)
      console.error("Error uploading images:", error);
      // Handle errors appropriately
    }
  }

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
          ["clean"],
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
    "clean",
  ];

  return (
    <>
    
      <div className={styles.wrapper}>
      <input
            type="text"
            placeholder="Title"
            className="writeInput"
            disabled={!userData.isAdmin && !userData.isSuperAdmin}
            autoFocus={true}
            onChange={(e) => setTitle(e.target.value)}
          />
        <QuillEditor
          ref={(el) => (quill.current = el)}
          className={styles.editor}
          theme="snow"
          value={value}
          formats={formats}
          modules={modules}
          onChange={(value) => setValue(value)}
        />
        <button onClick={handler} className={styles.btn}>
          Submit
        </button>

        {loading && (
          <>
            <Oval
              visible={true}
              height="80"
              width="80"
              color="#4fa94d"
              ariaLabel="oval-loading"
              wrapperStyle={{}}
              wrapperClass=""
            />
          </>
        )}
      </div>
    </>
  );
};

export default Write;
