import { Alert, Button, Textarea, TextInput } from 'flowbite-react'
import React, { useState } from 'react'
import { useSelector } from 'react-redux'
import { Link } from 'react-router-dom'

export default function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user)
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)
        if (comment.length > 200) {
            return
        }
        try {
            const res = await fetch('/api/comment/create', {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ content: comment, postId, userId: currentUser._id})
            })
            const data = await res.json()
            if (res.ok) {
                setComment('')
            } else {
                setError(data.message)
            }
        } catch (error) {
            setError(error.message)
        }
    }
  return (
    <div className='max-w-2xl mx-auto w-full p-3'>
        {currentUser ? (
            <div className="flex items-center gap-1 my-5 text-gray-500 text-sm">
                <p>Signed in as:</p>
                <img className='h-5 w-5 object-cover rounded-full' src={currentUser.profilePicture} alt="Profile Picture" />
                <Link to={'/dashboard?tab=profile'} className='text-xs text-cyan-600 hover:underline'>
                @{currentUser.username}
                </Link>
            </div>
        ) : (
            <div className="text-sm text-teal-500 my-5 flex gap-1">
                You must be logged in to comment.
                <Link to='/sign-in' className='text-blue-500 hover:underline'>
                    Sign In
                </Link>
            </div>
        )}
        {currentUser && (
            <form className='border border-teal-500 rounded-md p-3' onSubmit={handleSubmit}>
                <Textarea placeholder='Add a comment...' rows='3' maxLength='250' onChange={(e) => setComment(e.target.value)} value={comment}/>
                <div className="flex justify-between items-center mt-5">
                    <p className={comment.length > 200 ? ('text-red-500 text-xs'): ('text-gray-500 text-xs')}>{comment.length}/200 characters</p>
                    <Button className='' outline gradientDuoTone='purpleToBlue' type='submit'>Submit</Button>
                </div>
            </form>
        )}
    {error && (
        <Alert color='failure'>
            {error}
        </Alert>
    )}
    </div>
  )
}
