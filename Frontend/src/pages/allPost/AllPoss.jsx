import { useState,useEffect } from "react"
import Posts from "../../components/posts/Posts"
import axios from "axios"
import { useLocation } from "react-router"

export default function Home() {
  const [posts,setPosts] = useState([]);
  const {search} = useLocation()

  useEffect(()=>{
    const fetchPosts = async()=>{
        try {
            console.log(search)
            const res = await axios.get("http://localhost:5000/api/posts/title/"+search)
            setPosts(res.data)
            console.log(res.data)
        } catch (error) {
            console.log(error)
        }
    }
    fetchPosts()
  },[search])
  
  return (
    <>
    {posts.length === 0 ? <h1 style={{textAlign:"center"}}>No Post To desplay</h1> : ''}
      <div className="home">
        <Posts posts={posts}/>
      </div>
    </>
  )
}