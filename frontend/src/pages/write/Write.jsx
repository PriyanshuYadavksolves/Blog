import React, { useState } from "react";
import axios from 'axios';
import "./write.css";
import { useNavigate } from "react-router-dom";

const Write = () => {
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null); // State for image preview
  const [statusMsg,setStatusMsg] = useState(null)

  const navigate = useNavigate();
  const handleFileChange = (e) => {
    const file = e.target.files[0]; 
    if (file) {
      // Check if the selected file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file.');
        setSelectedFile(null); 
        return;
      }
      // Check file size
      if (file.size > 10 * 1024 * 1024) {
        alert('File size exceeds 10MB. Please select a smaller file.');
        setSelectedFile(null); 
      } else {
        setSelectedFile(file);
        // Generate preview of the selected image
        const reader = new FileReader();
        reader.onloadend = () => {
          setImagePreview(reader.result);
        };
        reader.readAsDataURL(file);
      }
    }
  };
  

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (title.trim().length !== 0 && desc.trim().length !== 0 && selectedFile) {
        setStatusMsg('loading...')
      try {
        const formData = new FormData();
        formData.append('image', selectedFile);
        formData.append('title', title);
        formData.append('desc', desc);
        formData.append('author',"priyanshu")

        const response = await axios.post('http://localhost:8000/api/blog/createBlog', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        });

        console.log('Image uploaded:', response.data);
        if(response.data){
            setStatusMsg('Image Uploded')
            setTimeout(() => {
                setStatusMsg(null)
            }, 3000);
        }
        setTitle('')
        setDesc('')
        setSelectedFile('')
        setImagePreview(null);
        navigate('/home');
      } catch (error) {
        console.error('Error uploading image:', error);
        setStatusMsg("Something Went Wrong")
      }
    } else {
      alert('Please enter all values');
       setStatusMsg("Something Went Wrong");
      // Reset the file input field and image preview on error
      setSelectedFile(null);
      setImagePreview(null);
    }
  };

  return (
    <div className="form-window">
      <h1>Add Image</h1>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          name="title"
          value={title}
          placeholder="Enter Title"
          className="title"
          required
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="brake">
          <textarea
            type="text"
            name="desc"
            value={desc}
            placeholder="Enter Desc"
            rows={8}
            cols={40}
            required
            onChange={(e) => setDesc(e.target.value)}
          />
          
        </div>
        {imagePreview && (
          <img src={imagePreview} alt="Preview" className="preview-image" />
          )}
          <input
              type="file"
              name="photo"
              required
              onChange={handleFileChange}
            />
        {statusMsg && <span className="span">{statusMsg}</span>}
        <button type="submit">Publish</button>
      </form>

    </div>
  );
};

export default Write;
