import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Alert, Avatar, Button, Label, Spinner, TextInput } from 'flowbite-react'
import OAuth from '../components/OAuth'

export default function SignUp() {
  const [formData, setFormData] = useState({})
  const [errorMessage, setErrorMessage] = useState(null)
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()
  const handleChange = (e) => {
    setFormData({...formData, [e.target.id]: e.target.value.trim()})
  }
  const handleSubmit  = async (e) => {
    e.preventDefault()
    setLoading(true)
    setErrorMessage(null)
    if (!formData.username || !formData.email || !formData.password) {
      setLoading(false)
      return setErrorMessage("Please fill out all fields.")
    }
    try {
      const res = await fetch('/api/auth/sign-up', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success === false) {
        setLoading(false)
        return setErrorMessage(data.message)
      }
      setLoading(false)
      if (res.ok) {
        navigate('/sign-in')
      }
    } catch (error) {
      setErrorMessage(error.message)
      setLoading(false)
    }
  }
  return (
    <div className='min-h-screen mt-20'>
      <div className='flex p-3 max-w-3xl mx-auto flex-col md:flex-row md:items-center gap-10'>
        <div className='flex-1'>
          {/* left */}
          <Link to="/" className='font-bold dark:text-white text-4xl'>
            <div className="flex space-x-2 space-y-4">
                <Avatar img="/images/blogicon.jpg" size="lg" />
                <span className='px-0 py-1'>Kevin's Blog</span>
            </div>
            </Link>
            <p className='text-sm mt-5'>
              This is a blog platform for myself, to talk about topics that interest me, like programming, video games, anime/manga, volleyball and boxing.
              <br/><br/>You can sign up with your email or Google to join the discussion.
            </p>
        </div>
        <div className='flex-1'>
          {/* right */}
          <form className='flex flex-col gap-4' onSubmit={handleSubmit}>
            <div>
              <Label value="Your username" />
              <TextInput type='text' placeholder='Username' id='username' onChange={handleChange}/>
            </div>
            <div>
              <Label value="Your email" />
              <TextInput type='email' placeholder='user@email.com' id='email' onChange={handleChange}/>
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type='password' placeholder='password' id='password' onChange={handleChange}/>
            </div>
            <Button type='submit' gradientMonochrome="cyan" disabled={loading}>
              {
                loading ? (
                  <>
                  <Spinner size='sm' />
                  <span className='pl-3'>Loading...</span>
                  </>
                ) : 'Sign Up'
              }
            </Button>
            <OAuth />
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
          {
            errorMessage && (
              <Alert className='mt-5' color='failure'>
                {errorMessage}
              </Alert>
            )
          }
        </div>
      </div>
    </div>
  )
}
