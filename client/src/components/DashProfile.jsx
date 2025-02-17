import { Alert, Button, TextInput } from 'flowbite-react'
import React, { useEffect, useRef, useState } from 'react'
import {useSelector} from 'react-redux'
import { updateStart, updateSuccess, updateFailure } from '../redux/user/userSlice'
import { useDispatch } from 'react-redux'

export default function DashProfile() {
    const {currentUser} = useSelector(state => state.user)
    const [formData, setFormData] = useState({})
    const [updateUserSuccess, setUpdateUserSuccess] = useState(null)
    const [updateUserError, setUpdateUserError] = useState(null)
    const dispatch = useDispatch()
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
    // notice: Firebase storage is now paid... user will not be able to change their profile picture
    // const [imageFile, setImageFile] = useState(null)
    // const [imageFileUrl, setImageFileUrl] = useState(null)
    // const filePickerRef = useRef()
    // const handleImageChange = (e) => {
    //     const file = e.target.files[0]
    //     if (file) {
    //         setImageFile(file)
    //         setImageFileUrl(URL.createObjectURL(file))
    //     }
    // }
    // useEffect(() => {
    //     if (imageFile) {
    //         uploadImage()
    //     }
    // }, [imageFile])

    // const uploadImage = async () => {
    //     console.log("Uploading image...")
    // }
  return (
    <div className='max-w-lg mx-auto p-3 w-full'>
        <h1 className='my-7 text-center font-semibold text-3xl'>Profile</h1>
        <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            {/* <input type='file' accept='image/*' onChange={handleImageChange} ref={filePickerRef} hidden/> */}
            <div className="w-32 h-32 self-center shadow-md overflow-hidden rounded-full">
                <img src={/*imageFileUrl || */currentUser.profilePicture} alt="user" 
                className='rounded-full w-full h-full object-cover border-8 border-[lightgray]'/>
            </div>
            <TextInput type='text' id='username' placeholder='username' defaultValue={currentUser.username} onChange={handleChange}/>
            <TextInput type='text' id='email' placeholder='email' defaultValue={currentUser.email} onChange={handleChange}/>
            <TextInput type='password' id='password' onChange={handleChange} placeholder='password'/>
            <Button type='submit' gradientDuoTone='purpleToBlue' outline >
                Update
            </Button>
        </form>
        <div className="text-red-500 flex justify-between mt-5">
            <span className='cursor-pointer'>Delete Account</span>
            <span className='cursor-pointer'>Sign Out</span>
        </div>
        {updateUserSuccess && (
            <Alert color='success' className='mt-5'>
                {updateUserSuccess}
            </Alert>
        )}
        {updateUserError && (
            <Alert color='failure' className='mt-5'>
                {updateUserError}
            </Alert>)}
    </div>
  )
}
