import React from 'react'
import { Link } from 'react-router-dom'
import { Avatar, Button, Label, TextInput } from 'flowbite-react'

export default function SignUp() {
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
          <form className='flex flex-col gap-4'>
            <div>
              <Label value="Your username" />
              <TextInput type='text' placeholder='Username' id='username'/>
            </div>
            <div>
              <Label value="Your email" />
              <TextInput type='text' placeholder='user@email.com' id='email'/>
            </div>
            <div>
              <Label value="Your password" />
              <TextInput type='text' placeholder='password' id='password'/>
            </div>
            <Button type='submit' gradientMonochrome="cyan">
              Sign Up
            </Button>
          </form>
          <div className='flex gap-2 text-sm mt-5'>
            <span>Have an account?</span>
            <Link to='/sign-in' className='text-blue-500'>Sign In</Link>
          </div>
        </div>
      </div>
    </div>
  )
}
