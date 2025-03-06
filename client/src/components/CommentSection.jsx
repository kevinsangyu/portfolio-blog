import { Alert, Button, Textarea, Modal} from 'flowbite-react'
import React, { useState, useEffect } from 'react'
import { useSelector } from 'react-redux'
import { Link, useNavigate } from 'react-router-dom'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import Comment from './Comment'
import { useDispatch } from "react-redux";
import { signInFailure, signOutSuccess } from '../redux/user/userSlice.js'

export default function CommentSection({postId}) {
    const { currentUser } = useSelector((state) => state.user)
    const [comment, setComment] = useState('')
    const [error, setError] = useState(null)
    const [comments, setComments] = useState([])
    const [showModal, setShowModal] = useState(false)
    const [commentToDelete, setCommentToDelete] = useState(null)
    const navigate = useNavigate()
    const dispatch = useDispatch()
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
                setComments([data, ...comments])
            } else {
                if (res.status === 420) { // user info present in redux, but cookies have expired.
                    dispatch(signOutSuccess());
                    dispatch(signInFailure("You have been logged out. Please log back in."))
                }
                setError(data.message)
            }
        } catch (error) {
            setError(error.message)
        }
    }
    useEffect(() => {
        const getComments = async () => {
            try {
                const res = await fetch(`/api/comment/getPostComments/${postId}`)
                if (res.ok) {
                    const data = await res.json()
                    setComments(data)
                }
            } catch (error) {
                console.log(error)
            }
        }
        getComments()
    }, [postId])
    const handleLike = async (commentId) => {
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return
            }
            const res = await fetch(`/api/comment/likeComment/${commentId}`, {
                method: "PUT"
            })
            if (res.ok) {
                const data = await res.json()
                setComments(comments.map((comment) => (
                    comment._id === commentId ? {
                        ...comment,
                        likes: data.likes,
                        numberOfLikes: data.likes.length
                    } : comment
                )))
            } else if (res.status === 420) { // user info present in redux, but cookies have expired.
                dispatch(signOutSuccess());
                dispatch(signInFailure("You have been logged out. Please log back in."))
            }
        } catch (error) {
            console.log(error)
        }
    }
    const handleEdit = async (comment, editedContent) => {
        setComments(
            comments.map((c) => 
                c._id === comment._id ? {...c, content: editedContent} : c
            )
        )
    }
    const handleError = async () => {
        dispatch(signOutSuccess())
        dispatch(signInFailure("You have been logged out. Please log back in."))
    }
    const handleDelete = async (commentId) => {
        setShowModal(false)
        try {
            if (!currentUser) {
                navigate('/sign-in')
                return
            }
            const res = await fetch(`/api/comment/deleteComment/${commentId}`, {
                method: "DELETE"
            })
            if (res.ok) {
                const data = await res.json()
                setComments(comments.filter((comment) => comment._id !== commentId))
            } else if (res.status === 420) { // user info present in redux, but cookies have expired.
                dispatch(signOutSuccess());
                dispatch(signInFailure("You have been logged out. Please log back in."))
            }
        } catch (error) {
            console.log(error)
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
                {error && (
                    <Alert color='failure' className='mt-5'>
                        {error}
                    </Alert>
                )}
            </form>
        )}
        {comments.length === 0 ? (
            <p className='text-sm my-5'>No comments yet</p>
        ): (
            <>
            <div className="text-sm my-5 flex items-center gap-1">
                <p>Comments</p>
                <div className="border border-gray-400 py-1 px-2 rounded-sm">
                    <p>{comments.length}</p>
                </div>
            </div>
            {
                comments.map((comment) => (
                    <Comment key={comment._id} comment={comment} onLike={handleLike} onEdit={handleEdit} onDelete={(commentId) => {setShowModal(true);setCommentToDelete(commentId)}} onError={handleError} />
                ))
            }
            </>
        )}
        <Modal
            show={showModal}
            onClose={() => setShowModal(false)}
            popup
            size="md"
          >
            <Modal.Header />
            <Modal.Body>
              <div className="text-center">
                <HiOutlineExclamationCircle className="h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto" />
                <h3 className="mb-5 text-lg text-gray-500 dark:text-gray-400">
                  Are you sure you want to delete your comment?
                </h3>
              </div>
              <div className="flex justify-center gap-4">
                <Button color="failure" onClick={() => handleDelete(commentToDelete)}>
                  Yes, I'm sure
                </Button>
                <Button color="gray" onClick={() => setShowModal(false)}>
                  Cancel
                </Button>
              </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
