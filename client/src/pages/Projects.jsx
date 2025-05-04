import React from 'react'
import CallToAction from '../components/CallToAction'
import { Link } from 'react-router-dom'

export default function Projects() {
  return (
    <div className='min-h-screen max-w-2xl mx-auto flex justify-center items-center flex-col gap-6 p-3'>
      <h1 className='text-3xl font-semibold'>Projects</h1>
      <p className='text-md text-gray-500'>Check out my personal projects that I've developed! Most of these are just for my convenience.</p>
      {/* Re-using the postcard code to display projects... */}
      {/* QR Code Generator */}
      <div className='group relative w-full border border-teal-500 hover:border-2 h-[400px] overflow-hidden rounded-lg sm:w-[430px] transition-all'>
        <Link to={'/projects/qr'}>
        <img src={'https://firebasestorage.googleapis.com/v0/b/portfolio-blog-16951.firebasestorage.app/o/kevincodexQRcode.png?alt=media&token=2f5c6131-9eb8-432c-b77b-ca46c70d946f'}
         alt='QR Code generator' className='h-[350px] w-full object-cover group-hover:h-[300px] transition-all duration-300
        z-20'/>
        </Link>
        <div className="p-3 flex flex-col gap-2">
            <p className='text-lg font-semibold line-clamp-2'>QR Code generator</p>
            <Link to={'/projects/qr'} className='z-10 group-hover:bottom-0 absolute bottom-[-200px] left-0 right-0 border
            border-teal-500 text-teal-500 hover:bg-teal-500 hover:text-white transition-all duration-300 text-center
            py-2 rounded-md m-2'>Go to project</Link>
        </div>
      </div>
      
      <CallToAction header={"More projects coming Soon..."} body={"New features are still being developed..."} button={"Sign Up for Email Alerts"} 
      button_address={'/sign-up'} image={'https://landingfoliocom.imgix.net/components/1588570917022_ctapng?&q=75&auto=format&crop=top,left&fit=crop&auto=format&w=1500&h=900'}/>
    </div>
  )
}
