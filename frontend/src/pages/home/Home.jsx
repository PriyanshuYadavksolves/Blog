import React, { useEffect, useState } from 'react'
import Header from '../../components/header/Header'
import Posts from '../../components/posts/Posts'
import axios from 'axios'

const Home = () => {
    const [posts,setPosts] = useState([])

    useEffect(()=>{
        const fetchPosts = async()=>{
            try {
                const res = await axios.get('http://localhost:8000/api/blog/getAll')
                setPosts(res.data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchPosts()
    },[])
  return (
    <>
      <Header/>
      <div className="home">
        <Posts posts={posts}/>
      </div>
    </>
  )
}

export default Home
