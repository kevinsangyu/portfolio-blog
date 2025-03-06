import { Alert, Button, Modal, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { updateStart, updateSuccess, updateFailure, deleteUserStart, deleteUserSuccess, deleteUserFailure, signOutSuccess, signInFailure } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'
import { HiOutlineExclamationCircle } from 'react-icons/hi'
import { Link, useNavigate } from 'react-router-dom'
import {getDownloadURL, getStorage, ref, uploadBytesResumable} from 'firebase/storage'
import { app } from '../firebase'
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';


export default function DashProfile() {
    const {currentUser, error, loading} = useSelector(state => state.user)
    const [formData, setFormData] = useState({})
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const [showModal, setShowModal] = useState(false)
    const dispatch = useDispatch()
    const navigate = useNavigate()
    const handleChange = (e) => {
        setFormData({...formData, [e.target.id]: e.target.value})
    }
    const handleSubmit = async (e) => {
        e.preventDefault()
        setUpdateUserSuccess(null)
        setUpdateUserError(null)
        if (Object.keys(formData).length === 0) {
            setUpdateUserError("No changes were made")
            return
        }
        if (imageUploadProgress) {
            setUpdateUserError("Please wait for profile image to complete uploading")
            return
        }
        try {
            dispatch(updateStart())
            const res = await fetch(`/api/user/update/${currentUser._id}`, {
                method: "PUT",
                headers: {
                    'Content-Type' : 'application/json'
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (!res.ok) {
                if (res.status === 420) { // user info present in redux, but cookies have expired.
                    dispatch(signOutSuccess());
                    dispatch(signInFailure("You have been logged out. Please log back in."))
                }
                dispatch(updateFailure(data.message))
                setUpdateUserError(data.message)
            } else {
                dispatch(updateSuccess(data))
                setUpdateUserSuccess("User profile updated successfully")
            }
        } catch (error) {
            dispatch(updateFailure(error.message))
            setUpdateUserError(error.message)
        }
    }
    const handleDeleteUser = async (e) => {
        setShowModal(false)
        try {
            dispatch(deleteUserStart())
            const res = await fetch(`/api/user/delete/${currentUser._id}`, {
                method: "DELETE"
            })
            const data = await res.json()
            if (!res.ok) {
                if (res.status === 420) { // user info present in redux, but cookies have expired.
                    dispatch(signOutSuccess());
                    dispatch(signInFailure("You have been logged out. Please log back in."))
                }
                dispatch(deleteUserFailure(data.message))
            } else {
                dispatch(deleteUserSuccess(data))
            }
        } catch (error) {
            dispatch(deleteUserFailure(error.message))
        }
    }
    const handleSignOut = async () => {
        try {
            const res = await fetch('/api/user/signout', {
                method: 'POST',
            })
            const data = await res.json()
            if (!res.ok) {
                console.log(data.message)
            } else {
                dispatch(signOutSuccess())
            }
        } catch (error) {
            console.log(error)
        }
    }
    const [imageFile, setImageFile] = useState(null)
    const [imageFileUrl, setImageFileUrl] = useState(null)
    const [imageUploadProgress, setImageUploadProgress] = useState(null)
    const [imageUploadError, setImageUploadError] = useState(null)
    const filePickerRef = useRef()
    const handleImageChange = (e) => {
        const file = e.target.files[0]
        if (file) {
            setImageFile(file)
            setImageFileUrl(URL.createObjectURL(file))
        }
    }
    useEffect(() => {
        if (imageFile) {
            uploadImage()
        }
    }, [imageFile])

    const uploadImage = async () => {
        setImageUploadError(null)
        const storage = getStorage(app)
        const fileName = new Date().getTime() + imageFile.name
        const storageRef = ref(storage, fileName)
        const uploadTask = uploadBytesResumable(storageRef, imageFile)
        uploadTask.on(
            'state_changed',
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                setImageUploadProgress(progress.toFixed(0))
            },
            (error) => {
                setImageUploadError("Could not upload image (File must be mess than 2MB)")
                setImageUploadProgress(null)
                setImageFile(null)
                setImageFileUrl(null)
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    setImageFileUrl(downloadURL)
                    setFormData({...formData, profilePicture: downloadURL})
                    setImageUploadProgress(null)
                })
            }
        )
    }
    const handleCreatePostButton = async () => {
        try {
            const res = await fetch(`/api/test/testsignedin`, {method: 'GET'})
            const data = await res.json()
            if (res.ok) {
                navigate('/create-post')
            } else if (res.status === 420) { // user info present in redux, but cookies have expired.
                dispatch(signOutSuccess());
                dispatch(signInFailure("You have been logged out. Please log back in."))
            }
        } catch (error) {
            console.log(error)
        }
    }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/>
            <div className="relative w-32 h-32 self-center shadow-md overflow-hidden rounded-full">
                {imageUploadProgress && (
                    <CircularProgressbar value={imageUploadProgress || 0} text={`${imageUploadProgress}%`} strokeWidth={5} styles={{
                        root:{
                            width: "100%",
                            height: "100%",
                            position: "absolute",
                            top: 0,
                            left: 0
                        },
                        path:{
                            stroke: `rgba(62, 152, 199, ${imageUploadProgress / 100})`
                        }
                    }} />
                )}
                <img src={imageFileUrl || currentUser.profilePicture} alt="user" 
                className={`rounded-full w-full h-full object-cover border-8 border-[lightgray] ${imageUploadProgress && imageUploadProgress < 100 && 'opacity-50'}`}
                 onClick={()=> filePickerRef.current.click()}/>
            </div>
            {imageUploadError && (
                <Alert color='failure'>
                    {imageUploadError}
                </Alert>
            )}
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' onChange={handleChange} placeholder='password'/>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline disabled={loading || imageUploadProgress}>
                {loading ? 'Loading...' : "Update"}
            </Button>
            {currentUser.isAdmin && (
                <Button type='button' gradientDuoTone='purpleToPink' className='w-full' onClick={handleCreatePostButton}>
                    Create a Post
                </Button>
            )}
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className='cursor-pointer' onClick={()=>setShowModal(true)}>Delete Account</span>
            <span className='cursor-pointer' onClick={handleSignOut}>Sign Out</span>
        </div>
        {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
                {updateUserSuccess}
            </Alert>
        )}
        {updateUserError && (
            <Alert color='failure' className='mt-5'>
                {updateUserError}
            </Alert>
        )}
        {error && (
            <Alert color='failure' className='mt-5'>
                {error}
            </Alert>
        )}
        <Modal show={showModal} onClose={() => setShowModal(false)} popup size='md'>
            <Modal.Header />
            <Modal.Body>
                <div className="text-center">
                    <HiOutlineExclamationCircle className='h-14 w-14 text-gray-400 dark:text-gray-200 mb-4 mx-auto'/>
                    <h3 className='mb-5 text-lg text-gray-500 dark:text-gray-400'>Are you sure you want to delete your account?</h3>
                </div>
                <div className="flex justify-center gap-4">
                    <Button color='failure' onClick={handleDeleteUser}>
                        Yes, I'm sure
                    </Button>
                    <Button color='gray' onClick={() => setShowModal(false)}>
                        Cancel
                    </Button>
                </div>
            </Modal.Body>
        </Modal>
    </div>
  )
}
