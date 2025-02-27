import React from 'react'
import CallToAction from '../components/CallToAction'

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>Check out my personal projects that I've developed! Most of these are just for my convenience.</p>
      <CallToAction header={"Coming Soon..."} body={"This feature is still being developed..."} button={"Sign Up for Email Alerts"} button_address={'/sign-up'} image={'https://landingfoliocom.imgix.net/components/1588570917022_ctapng?&q=75&auto=format&crop=top,left&fit=crop&auto=format&w=1500&h=900'}/>
    </div>
  )
}
