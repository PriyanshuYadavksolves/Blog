import { useState, useEffect } from "react";
import Header from "../../components/header/Header";
import Posts from "../../components/posts/Posts";
import "./home.css";
import axios from "axios";
// import { useLocation } from "react-router";
import { toast } from "react-toastify";
import { Oval } from "react-loader-spinner";
import Cookies from "js-cookie";

export default function Home() {
  const [posts, setPosts] = useState([]);
  // const { search } = useLocation();
  const [pageNumber, setPageNumber] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setloading] = useState(false);
  const token = Cookies.get('token')

  const fetchPosts = async () => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/posts/getAllPosts?pageNumber=${pageNumber}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setPosts((prevPost) => [...prevPost, ...res.data.data]);
      setPageNumber(pageNumber + 1);
      if (!res.data.next) {
        setHasMore(false);
      }
    } catch (error) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const handleScroll = async (e) => {
    const bottom =
      e.target.scrollHeight - Math.ceil(e.target.scrollTop) <=
      e.target.clientHeight;
    if (bottom && hasMore && !loading) {
      setloading(true);
      try {
        await fetchPosts();
      } finally {
        setloading(false);
      }
    }
  };

  return (
    <div className="scroll" onScroll={handleScroll}>
      <Header />
      <div className="home">
        {posts.length === 0 && <h1>No Post To Display</h1>}
        <Posts posts={posts} />
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
    </div>
  );
}
