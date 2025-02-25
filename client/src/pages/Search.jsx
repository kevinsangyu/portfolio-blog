import { Select, TextInput, Button, Spinner } from 'flowbite-react'
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import PostCard from '../components/PostCard'

export default function Search() {
    const navigate = useNavigate()
    const [sidebarData, setSidebarData] = useState({
        searchTerm: '',
        order: 'desc',
        category: 'general'
    })
    const [posts, setPosts] = useState([])
    const [loading, setLoading] = useState(false)
    const [showMore, setShowMore] = useState(false)

    useEffect(() => {
        const urlParams = new URLSearchParams(location.search)
        const searchTermFromUrl = urlParams.get('searchTerm') || ''
        const orderFromUrl = urlParams.get('order') || 'desc'
        const categoryFromUrl = urlParams.get('category') || 'general'
        if (searchTermFromUrl || orderFromUrl || categoryFromUrl) {
            setSidebarData({
                ...sidebarData,
                searchTerm: searchTermFromUrl,
                order: orderFromUrl,
                category: categoryFromUrl
            })
        }

        const fetchPosts = async () => {
            setLoading(true)
            const searchQuery = urlParams.toString()
            const res = await fetch(`/api/post/getposts?${searchQuery}`)
            if (!res.ok) {
                setLoading(false)
                return
            } else {
                const data = await res.json()
                setPosts(data.posts)
                setLoading(false)
                if (data.posts.length === 9) {
                    setShowMore(true)
                } else {
                    setShowMore(false)
                }
            }
        }
        fetchPosts()
    }, [location.search])
    const handleChange = (e) => {
        if (e.target.id === 'searchTerm') {
            setSidebarData({...sidebarData, searchTerm: e.target.value})
        }
        else if (e.target.id === 'order') {
            const order = e.target.value || 'desc'
            setSidebarData({...sidebarData, order: order})
        }
        else if (e.target.id === 'category') {
            const category = e.target.value || 'general'
            setSidebarData({...sidebarData, category: category})
        }
    }
    const handleSubmit = (e) => {
        e.preventDefault();
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('searchTerm', sidebarData.searchTerm);
        urlParams.set('order', sidebarData.order);
        urlParams.set('category', sidebarData.category);
        const searchQuery = urlParams.toString();
        navigate(`/search?${searchQuery}`);
    };
    const handleShowMore = async () => {
        const numberOfPosts = posts.length;
        const startIndex = numberOfPosts;
        const urlParams = new URLSearchParams(location.search);
        urlParams.set('startIndex', startIndex);
        const searchQuery = urlParams.toString();
        const res = await fetch(`/api/post/getposts?${searchQuery}`);
        if (!res.ok) {
          return;
        }
        if (res.ok) {
          const data = await res.json();
          setPosts([...posts, ...data.posts]);
          if (data.posts.length === 9) {
            setShowMore(true);
          } else {
            setShowMore(false);
          }
        }
      };
  return (
    <div className='flex flex-col md:flex-row'>
        <div className="p-7 border-b md:border-r md:min-h-screen border-gray-500">
            <form className='flex flex-col gap-8' onSubmit={handleSubmit}>
                <div className=" flex items-center gap-2 ">
                    <label className='whitespace-nowrap font-semibold'>Search Term:</label>
                    <TextInput placeholder='Search...' id='searchTerm' type='text' value={sidebarData.searchTerm} onChange={handleChange}/>
                </div>
                <div className=" flex items-center gap-2 ">
                    <label className='font-semibold'>Sort:</label>
                    <Select onChange={handleChange} value={sidebarData.order} id='order'>
                        <option value={'desc'}>Latest</option>
                        <option value={'asc'}>Oldest</option>
                    </Select>
                </div>
                <div className=" flex items-center gap-2 ">
                    <label className='font-semibold'>Category:</label>
                    <Select onChange={handleChange} value={sidebarData.category} id='category'>
                        <option value="general">General</option>
                        <option value="programming">Programming</option>
                        <option value="career">Career</option>
                        <option value="hobbies">Hobbies</option>
                        <option value="diary">Diary</option>
                    </Select>
                </div>
                <Button type='submit' outline gradientDuoTone='purpleToPink'>
                    Apply Filters
                </Button>
            </form>
        </div>
        <div className="w-full">
            <h1 className='text-3xl font-semibold sm:border-b border-gray-500 p-3 mt-5 '>Post results:</h1>
            <div className="p-7 flex flex-wrap gap-4">
                {!loading && posts.length === 0 && <p className='text-xl text-gray-500'>No posts found</p>}
                {loading && (<>
                    <div className="flex justify-center items-center min-w-full">
                        <Spinner size='xl'/>
                    </div>
                </>)}
                {!loading && posts && posts.map((post) => 
                    <PostCard key={post._id} post={post} />
                )}
                {showMore && (
                    <button className="textw-full hover:underline text-teal-500 self-center text-sm py-7" onClick={handleShowMore}>
                        Show more 
                    </button>
                )}
            </div>
        </div>
    </div>
  )
}
