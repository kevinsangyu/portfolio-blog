import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import PostCard from '../components/PostCard'
import CallToAction from '../components/CallToAction'

export default function Home() {
  const [posts, setPosts] = useState([])
  useEffect(() => {
    const fetchPosts = async () => {
      const res = await fetch('/api/post/getPosts')
      const data = await res.json()
      setPosts(data.posts)
    }
    fetchPosts()
  }, [])

  return (
    <div>
      <div className='relative flex items-center justify-center h-[80vh]' 
      style={{backgroundImage: 'url(images/hakuba.jpg)', backgroundSize: 'cover', backgroundPosition: 'center', backgroundRepeat: "no-repeat"}}>
        <div className="absolute flex flex-col gap-6 p-28 px-3 max-w-6xl top-1">
          <h1 className='text-3xl font-bold lg:text-6xl text-white'>Welcome to my Portfolio-Blog</h1>
          <p style={{textShadow: "-1px 1px 10px rgba(0, 0, 0, 1)"}} className='text-slate-100 text-xs sm:text-sm shadow-black drop-shadow-lg'>You'll find here anything that interests me, ranging from work and career related content to hobbies and personal opinions.</p>
          <Link to={'/search'} className='text-xs sm:text-sm text-teal-200 font-bold hover:underline'>View all posts</Link>
        </div>
      </div>
      <div className="p-3 bg-amber-100 dark:bg-slate-700 rounded-tl-3xl rounded-br-3xl max-w-2xl items-center justify-center mx-auto mt-8">
        <CallToAction header={"Looking for my Projects?"} body={"Check out my tools and projects in my 'Projects' page"} button={"My Projects"} 
        button_address={'/projects'} 
        image={'https://cdni.iconscout.com/illustration/premium/thumb/coding-project-illustration-download-in-svg-png-gif-file-formats--html-logo-software-development-business-pack-illustrations-1597918.png'}/>
      </div>
      <div className="max-w-[1350px] mx-auto p-3 flex flex-col gap-8 py-7">
        {posts && posts.length > 0 && (
          <div className="flex flex-col gap-6 ">
            <h2 className='text-2xl font-semibold text-center'>Recent Posts</h2>
            <div className="flex flex-wrap gap-4">
              {posts.map((post) => (
                <PostCard key={post._id} post={post} />
              ))}
            </div>
            <Link to='/search' className='text-lg text-teal-500 text-center'>View all posts</Link>
          </div>
        )}
      </div>
    </div>
  )
}
