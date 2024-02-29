import { useState,useEffect } from "react"
import Posts from "../../components/posts/Posts"
import "./singleuser.css"
import axios from "axios"
import { useLocation } from "react-router"

export default function Home() {
  const [posts,setPosts] = useState([]);
  const {search} = useLocation()

  useEffect(()=>{
    const fetchPosts = async()=>{
        try {
            const res = await axios.get("http://localhost:8000/api/blog/user/"+search)
            setPosts(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchPosts()
  },[search])
  
  return (
    <>
    {posts.length === 0 ? <h1 style={{textAlign:"center"}}>No Post To desplay</h1> : <h1 style={{textAlign:"center"}}>{search.split('=')[1]} Post's</h1>}
      <div className="home">
        <Posts posts={posts}/>
      </div>
    </>
  )
}
